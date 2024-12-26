import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos/auth.dto';
import { CreatedAuthDto } from './dtos/created-auth.dto';
import { RegisterAuthLocalInput } from './dtos/register-auth-local-input.dto';
import { Types } from 'mongoose';
import { AuthType } from './schemas/auth.schema';
import { AuthModule } from './auth.module';
import { UserRepository } from '../user/repositories/user.repository';
import { UserModule } from '../user/user.module';
import { generateMongoProvider } from '@/utils/mongo';
import { User } from '../user/schemas/user.schema';
import { AppDatabaseModule } from '@/infrastructures/database';
import { AppCacheModule } from '@/infrastructures/cache';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let authService: AuthService;
  let userRepository : UserRepository

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
		imports: [AuthModule,UserModule],
      providers: [],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
	userRepository = module.get<UserRepository>(UserRepository)
	// remove exist user 
	await userRepository.remove({username : "test@email.com"})	
  });

  describe('registerUserWithCredential', () => {
    it('should register a user and return CreatedAuthDto', async () => {
      const input: RegisterAuthLocalInput = { name: 'testuser', password: 'testpass', email : 'testuser' };
      const createdAuth : CreatedAuthDto = {
		"username": "test@email.com",
		"user": {
			"_id": new Types.ObjectId("676d046ea59350d13cfaf978"),
			"createdAt": new Date("2024-12-26T07:23:26.101Z"),
			"deletedAt": null,
			"email": "test@email.com",
			"name": "test",
			"updatedAt": new Date("2024-12-26T07:23:26.101Z")
		},
		"updatedAt": new Date("2024-12-26T07:23:26.101Z"),
		"type": AuthType.PASSWORD,
		"expiredAt": null,
		"deletedAt": null,
		"createdAt": new Date("2024-12-26T07:23:26.101Z") ,
		"authSecret": null,
		"authId": null,
		"_id":new Types.ObjectId("676d046ea59350d13cfaf97a")
	}

      jest.spyOn(authService, 'registerLocal').mockResolvedValue(createdAuth);

      const result = await resolver.registerUserWithCredential(input);
		
      expect(result).toEqual(createdAuth);
      expect(authService.registerLocal).toHaveBeenCalledWith(input);
    });
  });

  describe('loginWithCredential', () => {
    it('should login a user and return AuthDto', async () => {
      const username = 'testuser';
      const password = 'testpass';
      const context: any = {
        req: {
          ip: '127.0.0.1',
          headers: { 'user-agent': 'test-agent' },
        },
      };
      const authInfo: AuthDto = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
		"username": "test@email.com",
		"user": {
				"_id": new Types.ObjectId("676d046ea59350d13cfaf978"),
				"createdAt": new Date("2024-12-26T07:23:26.101Z"),
				"deletedAt": null,
				"email": "test@email.com",
				"name": "test",
				"updatedAt": new Date("2024-12-26T07:23:26.101Z")
			},
		"updatedAt": new Date("2024-12-26T07:23:26.101Z"),
		"type": AuthType.PASSWORD,
		"expiredAt": null,
		"deletedAt": null,
		"createdAt": new Date("2024-12-26T07:23:26.101Z") ,
		"authSecret": null,
		"authId": null,
		"_id":new Types.ObjectId("676d046ea59350d13cfaf97a")
      };

      jest.spyOn(authService, 'loginLocal').mockResolvedValue(authInfo);
      jest.spyOn(authService, 'saveSignInHistory').mockResolvedValue(undefined);

      const result = await resolver.loginWithCredential(username, password, context);
      expect(result).toEqual(authInfo);
      expect(authService.loginLocal).toHaveBeenCalledWith(username, password);
    
    });
  });

  describe('refreshToken', () => {
    it('should refresh the token and return AuthDto', async () => {
      const token = 'refresh-token';
      const authInfo: AuthDto = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
		"username": "test@email.com",
		"user": {
				"_id": new Types.ObjectId("676d046ea59350d13cfaf978"),
				"createdAt": new Date("2024-12-26T07:23:26.101Z"),
				"deletedAt": null,
				"email": "test@email.com",
				"name": "test",
				"updatedAt": new Date("2024-12-26T07:23:26.101Z")
			},
		"updatedAt": new Date("2024-12-26T07:23:26.101Z"),
		"type": AuthType.PASSWORD,
		"expiredAt": null,
		"deletedAt": null,
		"createdAt": new Date("2024-12-26T07:23:26.101Z") ,
		"authSecret": null,
		"authId": null,
		"_id":new Types.ObjectId("676d046ea59350d13cfaf97a")
      };

      jest.spyOn(authService, 'refreshToken').mockResolvedValue(authInfo);

      const result = await resolver.refreshToken(token);
      expect(result).toEqual(authInfo);
      expect(authService.refreshToken).toHaveBeenCalledWith(token);
    });
  });
});
