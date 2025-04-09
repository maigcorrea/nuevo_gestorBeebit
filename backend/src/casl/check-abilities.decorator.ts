import { SetMetadata } from '@nestjs/common';
import { Actions } from './casl-ability.factory';

export interface RequiredRule {
  action: Actions;
  subject: any;
}

export const CHECK_ABILITY_KEY = 'check_ability';
export const CheckAbilities = (...rules: RequiredRule[]) => SetMetadata(CHECK_ABILITY_KEY, rules);
