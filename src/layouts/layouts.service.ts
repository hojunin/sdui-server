import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLayoutInput } from './dto/create-layout.input';
import { UpdateLayoutInput } from './dto/update-layout.input';
import { Layout } from './entities/layout.entity';
import { ILike } from 'typeorm';

@Injectable()
export class LayoutsService {
  constructor(
    @InjectRepository(Layout)
    private readonly layoutRepository: Repository<Layout>,
  ) {}

  async create(createLayoutInput: CreateLayoutInput): Promise<Layout> {
    // 이전 레이아웃 비활성화
    await this.layoutRepository.update(
      { path: createLayoutInput.path.trim() },
      { isActive: false },
    );

    // 현재 path의 최신 revision 조회
    const latestLayout = await this.layoutRepository.findOne({
      where: { path: createLayoutInput.path.trim() },
      order: { revision: 'DESC' },
    });

    const layout = this.layoutRepository.create({
      ...createLayoutInput,
      path: createLayoutInput.path.trim(),
      revision: latestLayout ? latestLayout.revision + 1 : 1,
      isActive: true,
    });

    const savedLayout = await this.layoutRepository.save(layout);
    return savedLayout;
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
    const trimmedPath = path.trim();

    const allLayouts = await this.layoutRepository.find({
      where: [{ path: ILike(`%${trimmedPath}%`), isActive: true }],
      order: { revision: 'DESC' },
    });

    if (allLayouts.length === 0) {
      throw new NotFoundException(
        `Layout with path ${path} not found. Available paths: ${(
          await this.layoutRepository.find()
        )
          .map((l) => l.path)
          .join(', ')}`,
      );
    }

    return allLayouts[0];
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.layoutRepository.update(
      { id },
      { isActive: false },
    );
    return result.affected > 0;
  }

  async getLayoutHistory(path: string): Promise<Layout[]> {
    const trimmedPath = path.trim();
    return this.layoutRepository.find({
      where: [
        { path: trimmedPath },
        { path: ` ${trimmedPath}` },
        { path: ILike(`%${trimmedPath}`) },
      ],
      order: { revision: 'DESC' },
    });
  }

  async rollbackToRevision(path: string, revision: number): Promise<Layout> {
    const trimmedPath = path.trim();
    const targetRevision = await this.layoutRepository.findOne({
      where: [
        { path: trimmedPath, revision },
        { path: ` ${trimmedPath}`, revision },
        { path: ILike(`%${trimmedPath}`), revision },
      ],
    });

    if (!targetRevision) {
      throw new NotFoundException(
        `Revision ${revision} not found for path ${path}`,
      );
    }

    // 현재 활성화된 레이아웃을 비활성화
    await this.layoutRepository.update(
      { path: targetRevision.path, isActive: true },
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
