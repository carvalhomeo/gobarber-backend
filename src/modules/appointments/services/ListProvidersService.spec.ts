import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import ListProviderService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProviderService;

describe('ListProviders', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        
        listProviders = new ListProviderService(
            fakeUsersRepository
        );
    })
    it('should be able to list the providers', async () => {
        const user1 = await fakeUsersRepository.create({
            name: 'John Doe', 
            email: 'johndoe@email.com', 
            password: '12345'
        });

        const user2 = await fakeUsersRepository.create({
            name: 'Marie Pipes', 
            email: 'mariepipese@email.com', 
            password: '12345'
        });

        const loggedUser = await fakeUsersRepository.create({
            name: 'Sarah Hulling', 
            email: 'saraghulling@email.com', 
            password: '12345'
        });

       const providers = await listProviders.execute({
           user_id: loggedUser.id
       });
       
       expect(providers).toEqual([user1, user2]);
    });
})