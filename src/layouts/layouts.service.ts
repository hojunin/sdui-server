import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLayoutInput } from './dto/create-layout.input';
import { UpdateLayoutInput } from './dto/update-layout.input';
import { Layout } from './entities/layout.entity';

@Injectable()
export class LayoutsService {
  constructor(
    @InjectRepository(Layout)
    private readonly layoutRepository: Repository<Layout>,
  ) {}

  async create(createLayoutInput: CreateLayoutInput): Promise<Layout> {
    // TODO: 같은 path로 레이아웃 생성 요청이 들어오면 일단 기존 revision을 따라가도록 변경해야 함(현재 코드는 개발용)
    await this.layoutRepository.update(
      { path: createLayoutInput.path },
      { isActive: false },
    );

    // 현재 path의 최신 revision 조회
    const latestLayout = await this.layoutRepository.findOne({
      where: { path: createLayoutInput.path },
      order: { revision: 'DESC' },
    });

    const layout = this.layoutRepository.create({
      ...createLayoutInput,
      revision: latestLayout ? latestLayout.revision + 1 : 1,
      isActive: true,
    });

    return this.layoutRepository.save(layout);
  }

  async findAll(): Promise<Layout[]> {
    return this.layoutRepository.find({
      where: { isActive: true },
    });
  }

  async findAllTemplates(): Promise<Layout[]> {
    return this.layoutRepository.find({
      where: { isTemplate: true, isActive: true },
    });
  }

  async findOne(id: string): Promise<Layout> {
    const layout = await this.layoutRepository.findOne({
      where: { id },
    });
    if (!layout) {
      throw new NotFoundException(`Layout with ID ${id} not found`);
    }
    return layout;
  }

  async findByPath(path: string): Promise<Layout> {
    const layout = await this.layoutRepository.findOne({
      where: { path, isActive: true },
      order: { revision: 'DESC' },
    });

    if (!layout) {
      throw new NotFoundException(`Layout with path ${path} not found`);
    }
    return layout;
  }

  async update(
    id: string,
    updateLayoutInput: UpdateLayoutInput,
  ): Promise<Layout> {
    const currentLayout = await this.findOne(id);

    // 현재 활성화된 레이아웃을 비활성화
    await this.layoutRepository.update(
      { path: currentLayout.path, isActive: true },
      { isActive: false },
    );

    // 새로운 레이아웃 row 생성
    const newLayout = this.layoutRepository.create({
      ...currentLayout, // 기존 레이아웃의 기본 정보 복사
      ...updateLayoutInput, // 업데이트할 내용 적용
      id: undefined, // 새로운 ID 생성을 위해 undefined 설정
      revision: currentLayout.revision + 1,
      isActive: true,
    });

    return this.layoutRepository.save(newLayout);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.layoutRepository.update(
      { id },
      { isActive: false },
    );
    return result.affected > 0;
  }

  async getLayoutHistory(path: string): Promise<Layout[]> {
    return this.layoutRepository.find({
      where: { path },
      order: { revision: 'DESC' },
    });
  }

  async rollbackToRevision(path: string, revision: number): Promise<Layout> {
    const targetRevision = await this.layoutRepository.findOne({
      where: { path, revision },
    });

    if (!targetRevision) {
      throw new NotFoundException(
        `Revision ${revision} not found for path ${path}`,
      );
    }

    // 현재 활성화된 레이아웃을 비활성화
    await this.layoutRepository.update(
      { path, isActive: true },
      { isActive: false },
    );

    // 새로운 레이아웃 row 생성
    const newLayout = this.layoutRepository.create({
      ...targetRevision, // 타겟 리비전의 내용 복사
      id: undefined, // 새로운 ID 생성을 위해 undefined 설정
      revision: targetRevision.revision + 1,
      isActive: true,
    });

    return this.layoutRepository.save(newLayout);
  }

  async previewLayout(id: string): Promise<Layout> {
    const layout = await this.findOne(id);
    if (!layout) {
      throw new NotFoundException(`Layout with ID ${id} not found`);
    }
    return layout;
  }
}
