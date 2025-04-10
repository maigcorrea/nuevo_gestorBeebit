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
import { TaskStaff } from 'src/tasks_staff/entities/taskStaff.entity';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
type Subjects = InferSubjects<typeof Project | typeof Task | typeof Staff | typeof TaskStaff> | 'all';

export type AppAbility = PureAbility<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: Staff) {
    console.log('hola');
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility as AbilityClass<AppAbility>);
    console.log('[CASL] Usuario recibido:', user);
    console.log('[CASL] Tipo de usuario:', user.type);


    if (user.type?.toLowerCase().trim() === 'admin') {
      can('manage', 'all'); // puede hacer TODO
       
    } else {
      console.log('[CASL] Tipo de usuario:', user.type);
      can('read', Project);
      can('create', Project);
      can('read', Task);
      can('update', Task, { assigned_to: user.id });
      can('delete', Project, {created_by: user.id});
      can('read', Staff); // puede ver la lista de empleados (opcional)
      can('update', Staff, { id: user.id }); // puede actualizar su propio perfil
      cannot('delete', Staff); // no puede borrar empleados
      can('read', TaskStaff, { staff: {id: user.id} }); // puede ver sus propias asignaciones
      cannot('create', TaskStaff); // no puede asignarse
      cannot('delete', TaskStaff); // no puede quitarse
    }


    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
      conditionsMatcher: mongoQueryMatcher, // 👈 importante para usar condiciones
    });
  }
}