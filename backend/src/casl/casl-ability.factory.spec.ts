import { CaslAbilityFactory } from './casl-ability.factory';
import { Project } from 'src/project/entities/project.entity';
import { Task } from 'src/task/entities/task.entity';
import { Staff } from 'src/staff/entities/staff.entity';
import { TaskStaff } from 'src/tasks_staff/entities/taskStaff.entity';

describe('CaslAbilityFactory', () => {
  let caslFactory: CaslAbilityFactory;

  beforeEach(() => {
    caslFactory = new CaslAbilityFactory();
  });

  it('permite a admin hacer manage all', () => {
    const admin = { id: '1', type: 'admin' } as Staff;
    const ability = caslFactory.createForUser(admin);
    expect(ability.can('manage', 'all')).toBe(true);
  });

  it('no permite a user crear proyectos si no es admin', () => {
    const user = { id: '2', type: 'user' } as Staff;
    const ability = caslFactory.createForUser(user);
    expect(ability.can('create', Project)).toBe(false);
  });

  it('permite a user leer tareas propias', () => {
    const user = { id: '3', type: 'user' } as Staff;
    const ability = caslFactory.createForUser(user);
    const task = {
        id: 't1',
        title: '',
        description: '',
        associated_project: { id: 'p1' },
        start_date: new Date(),
        end_date: null,
        completed: false,
        priority: 'low',
        status: 'pending',
        assigned_to: '3',
      } as Task;
    expect(ability.can('update', task)).toBe(true);
  });

  it('no permite a user eliminar task_staff', () => {
    const user = { id: '4', type: 'user' } as Staff;
    const ability = caslFactory.createForUser(user);
    const rel = { staff: '4' } as TaskStaff;
    expect(ability.can('delete', rel)).toBe(false);
  });
});
