import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/entities/user.entity';
import { Role } from './users/entities/role.entity';
import { SeedService } from './database/seeds/seed.service';
import { AuthModule } from './auth/auth.module';
import { MenusModule } from './menus/menus.module';
import { Menu } from './menus/entities/menu.entity';
import { LayoutsModule } from './layouts/layouts.module';
import { Layout } from './layouts/entities/layout.entity';
import { WidgetsModule } from './widgets/widgets.module';
import { Widget } from './widgets/entities/widget.entity';
import { WidgetLayout } from './widgets/entities/widget-layout.entity';
import { WidgetRelation } from './widgets/entities/widget-relation.entity';
import GraphQLJSON from 'graphql-type-json';
import { FormValidationSchemasModule } from './form-validation-schemas/form-validation-schemas.module';
import { FormValidationSchema } from './form-validation-schemas/entities/form-validation-schema.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      sortSchema: true,
      context: ({ req, res }) => ({ req, res }),
      cors: {
        credentials: true,
        origin: true,
      },
      resolvers: { JSON: GraphQLJSON },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT'), 10),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [
          User,
          Role,
          Menu,
          Layout,
          Widget,
          WidgetLayout,
          WidgetRelation,
          FormValidationSchema,
        ],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Role]),
    UsersModule,
    AuthModule,
    MenusModule,
    LayoutsModule,
    WidgetsModule,
    FormValidationSchemasModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {}
