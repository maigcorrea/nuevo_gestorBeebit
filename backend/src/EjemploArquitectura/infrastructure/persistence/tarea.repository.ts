import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TareaRepositoryPort } from '../../domain/ports/tarea.repository.port';
import { Tarea } from '../../domain/entities/tarea.entity';
import { TareaOrmEntity } from './tarea.orm-entity';

@Injectable()
export class TareaRepository implements TareaRepositoryPort {
  constructor(
    @InjectRepository(TareaOrmEntity)
    private readonly repo: Repository<TareaOrmEntity>,
  ) {}

  async guardar(tarea: Tarea): Promise<Tarea> {
    const entity = this.repo.create({
      id: tarea.id,
      titulo: tarea.titulo,
      creadaEn: tarea.creadaEn,
      estado: tarea.estado,
    });
    const saved = await this.repo.save(entity);
    return new Tarea(saved.id, saved.titulo, saved.creadaEn, saved.estado as any);
  }

  async buscarTodas(): Promise<Tarea[]> {
    const entities = await this.repo.find();
    return entities.map(e => new Tarea(e.id, e.titulo, e.creadaEn, e.estado as any));
  }

  async buscarPorId(id: string): Promise<Tarea | null> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) return null;
    return new Tarea(entity.id, entity.titulo, entity.creadaEn, entity.estado as any);
  }

  async actualizar(tarea: Tarea): Promise<Tarea> {
    await this.repo.update({ id: tarea.id }, {
      titulo: tarea.titulo,
      estado: tarea.estado,
    });
    const updated = await this.repo.findOneBy({ id: tarea.id });
    if (!updated) {
      throw new Error('La tarea actualizada no fue encontrada');
    }
    return new Tarea(updated.id, updated.titulo, updated.creadaEn, updated.estado as any);
  }
}
