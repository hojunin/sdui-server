import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '../../users/entities/role.entity';
import { initialRoles } from './role.seed';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const roleRepository = app.get(getRepositoryToken(Role));

  try {
    const roles = roleRepository.create(initialRoles);
    await roleRepository.save(roles);
    console.log('Roles seeded successfully');
  } catch (error) {
    console.error('Error seeding roles:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
