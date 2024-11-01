import { UserController } from "../../../user/user.controller"
import { MockType, repositoryMockFactory } from "../mock";
import { UserService } from "../../../user/user.service";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../../../user/entities/user.entity";
import { CreateUserDto } from "../../../user/dto/create-user.dto";
import { UpdateUserDto } from "../../../user/dto/update-user.dto";

describe('User Controller', () => {
    let userController: UserController;
    let userServiceMock: MockType<UserService>;

    const userServiceMockFactory: () => MockType<UserService> = jest.fn(
        () => ({
            create: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            getTodayUserBirthday: jest.fn(),
            getFailedSending: jest.fn(),    
        })
    )

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserController,
                { provide: UserService, useFactory: userServiceMockFactory },
                {
                    provide: getRepositoryToken(User),
                    useFactory: repositoryMockFactory,
                },
            ]
        }).compile();
        
        userController = module.get<UserController>(UserController);
        userServiceMock = module.get(UserService);
    });

    it('should be defined', () => {
        expect(userController).toBeDefined();
    });

    it('should get user by Id', async () => {
        // Arrange
        const MOCK_RESULT = 0;
        const USER_ID = '1';
        const EXPECTED_RESPONSE = {
            data: MOCK_RESULT,
            status: 201
        }

        userServiceMock.findOne.mockReturnValue(MOCK_RESULT);

        // Act
        const RESULTS = await userController.findOne(USER_ID);

        // Assert
        expect(RESULTS).toEqual(EXPECTED_RESPONSE);
        expect(userServiceMock.findOne).toHaveBeenCalled();
        expect(userServiceMock.findOne).toHaveBeenCalledWith(parseInt(USER_ID));
    });

    it('should create user', async () => {
        // Arrange
        const PARAM = new CreateUserDto();
        PARAM.first_name = 'TEST';
        PARAM.last_name = 'TEST';
        PARAM.birthday = new Date();
        PARAM.email = 'TEST@TEST.TEST';
        PARAM.location = 'Asia/Bangkok';
        const EXPECTED_RESULTS = {
            data: 0,
        };
        const RESPONSE_RESULT = {
            status: 201,
            data: EXPECTED_RESULTS
        }
        userServiceMock.create.mockReturnValue(EXPECTED_RESULTS);

        // Assert
        expect(await userController.create(PARAM)).toEqual(
            RESPONSE_RESULT,
        );
        expect(userServiceMock.create).toHaveBeenCalled();
        expect(userServiceMock.create).toHaveBeenCalledWith(PARAM);
    });

    it('should update user', async () => {
        // Arrange
        const ID = '1';
        const PARAM = new UpdateUserDto();
        PARAM.first_name = 'TEST';
        PARAM.last_name = 'TEST';
        PARAM.birthday = new Date();
        PARAM.email = 'TEST@TEST.TEST';
        PARAM.location = 'Asia/Bangkok';
        const EXPECTED_RESULTS = {
            data: 0,
        };
        const RESPONSE_RESULT = {
            status: 201,
            data: EXPECTED_RESULTS
        }
        userServiceMock.update.mockReturnValue(EXPECTED_RESULTS);

        // Assert
        expect(await userController.update(ID, PARAM)).toEqual(
            RESPONSE_RESULT,
        );
        expect(userServiceMock.update).toHaveBeenCalled();
        expect(userServiceMock.update).toHaveBeenCalledWith(+ID, PARAM);
    });

    it('should delete user', async () => {
        // Arrange
        const ID = '1';
        const EXPECTED_RESULTS = true;
        const RESPONSE_RESULT = {
            status: 201,
            message: 'success delete user'
        }
        userServiceMock.remove.mockReturnValue(EXPECTED_RESULTS);

        // Assert
        expect(await userController.remove(ID)).toEqual(
            RESPONSE_RESULT,
        );
        expect(userServiceMock.remove).toHaveBeenCalled();
        expect(userServiceMock.remove).toHaveBeenCalledWith(+ID);
    });
})