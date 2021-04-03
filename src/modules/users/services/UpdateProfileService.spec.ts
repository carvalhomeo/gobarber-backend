import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfileService', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        updateProfile = new UpdateProfileService(
            fakeUsersRepository, 
            fakeHashProvider
        );
    })
    it('should be able to update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe', 
            email: 'johndoe@email.com', 
            password: '12345'
        });

       const updatedUser = await updateProfile.execute({
           user_id: user.id,
           name: 'John Mayers',
           email: 'johnmayers@example.com'
       });
       
       expect(updatedUser.name).toBe('John Mayers');
       expect(updatedUser.email).toBe('johnmayers@example.com');
    });

    it('should not be able to change to another user email', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe', 
            email: 'johndoe@email.com', 
            password: '12345'
        });

        const user = await fakeUsersRepository.create({
            name: 'Paul Sanders', 
            email: 'paulsanders@email.com', 
            password: '12345'
        });
       
       await expect(
        updateProfile.execute({
            user_id: user.id,
            name: 'Paul Sanders',
            email: 'johndoe@email.com'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe', 
            email: 'johndoe@email.com', 
            password: '123456'
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'johndoe@email.com',
            old_password: '123456',
            password: '123123'
        });
       
       expect(updatedUser.password).toBe('123123');
    });

    it('should be able to update the password without old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe', 
            email: 'johndoe@email.com', 
            password: '123456'
        });
       
       expect(
        updateProfile.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'johndoe@email.com',
            password: '123123'
        })
       ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe', 
            email: 'johndoe@email.com', 
            password: '123456'
        });
       
       expect(
        updateProfile.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'johndoe@email.com',
            old_password: '444444',
            password: '123123'
        })
       ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the profile from non-existing user', async () => {
        await expect(
            updateProfile.execute({
                user_id: 'non-existing user id',
                name: 'Test',
                email: 'test@example.com'
            })
        ).rejects.toBeInstanceOf(AppError);
    });
})