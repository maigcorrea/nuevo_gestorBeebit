import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { CaslAbilityFactory } from './casl-ability.factory';
  import { CHECK_ABILITY_KEY, RequiredRule } from './check-abilities.decorator';
  import { AppAbility } from './casl-ability.factory';
  
  @Injectable()
  export class AbilitiesGuard implements CanActivate {
    constructor(
      private reflector: Reflector,
      private caslAbilityFactory: CaslAbilityFactory,
    ) {}
  
    canActivate(context: ExecutionContext): boolean {
      console.log("en abilities.guard");
      const rules =
        this.reflector.get<RequiredRule[]>(
          CHECK_ABILITY_KEY,
          context.getHandler(),
        ) || [];
  
      const request = context.switchToHttp().getRequest();
      const user = request.user; // debe estar definido por tu estrategia JWT
      console.log('[GUARD] req.user:', request.user);

  
      const ability = this.caslAbilityFactory.createForUser(user);
  
      const isAllowed = rules.every((rule) =>
        ability.can(rule.action, rule.subject),
      );
      console.log('[AbilitiesGuard] Usuario:', user);
      console.log('[Guard] Rules:', rules);

      if (!isAllowed) throw new ForbiddenException('No tienes permisossss');
  
      return true;
    }
  }
  