import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class UnauthenticatedStrategy extends PassportStrategy(
  Strategy,
  'unauthenticated',
) {
  constructor() {
    super({
      secretOrKey: 'unauthenticated',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  authenticate() {
    return this.success({});
  }
}
