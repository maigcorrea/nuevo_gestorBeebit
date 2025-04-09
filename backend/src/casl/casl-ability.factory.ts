import { Injectable } from '@nestjs/common';
import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
  createMongoAbility
} from '@casl/ability';
import { mongoQueryMatcher } from '@casl/ability';
 //Aunque se llame createMongoQueryMatcher, funciona también sin MongoDB, porque solo compara condiciones (como { assigned_to: user.id }).


import { Project } from 'src/project/entities/project.entity';
import { Task } from 'src/task/entities/task.entity';
import { Staff } from 'src/staff/entities/staff.entity'; // tu entidad de usuario

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
type Subjects = InferSubjects<typeof Project | typeof Task | typeof Staff> | 'all';

export type AppAbility = PureAbility<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: Staff) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility as AbilityClass<AppAbility>);

    if (user.type === 'admin') {
      can('manage', 'all'); // puede hacer TODO
    } else {
      can('read', Project);
      can('read', Task);
      can('update', Task, { assigned_to: user.id });
      cannot('delete', Project);
      can('read', Staff); // puede ver la lista de empleados (opcional)
      can('update', Staff, { id: user.id }); // puede actualizar su propio perfil
      cannot('delete', Staff); // no puede borrar empleados
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
      conditionsMatcher: mongoQueryMatcher, // 👈 importante para usar condiciones
    });
  }
}