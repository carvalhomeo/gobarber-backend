import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';
import AppError from '@shared/errors/AppError';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);
    })
    it('should be able to create a new appointment', async () => {
        const appointment = await createAppointment.execute({
            date: new Date(), provider_id: '123443'
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123443');
    });

    it('should not be able to create two appointments on the same datetime', async () => {
        const appointmentDate = new Date(2020, 4, 10, 11);

        await createAppointment.execute({date: appointmentDate, provider_id: '123443'});

        await expect(
            createAppointment.execute(
                {
                    date: appointmentDate, 
                    provider_id: '123444'
                })
        ).rejects.toBeInstanceOf(AppError);
    });
})