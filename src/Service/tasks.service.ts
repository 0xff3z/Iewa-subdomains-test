import {Injectable, Logger, OnApplicationBootstrap} from '@nestjs/common';
import {Cron, CronExpression} from '@nestjs/schedule';
import {EventEmitter2} from "@nestjs/event-emitter";

@Injectable()
export class TasksService implements OnApplicationBootstrap {
    private readonly logger = new Logger(TasksService.name);
    constructor(
        private eventEmitter: EventEmitter2,

    ) {
    }

    onApplicationBootstrap() {
        this.eventEmitter.emit('marketplace.get-from-monday-event-new');
        this.eventEmitter.emit('monday-get-trainees');


    }

    // @Cron('45 * * * * *')
    // handleCron() {
    //     this.logger.debug('Called when the current second is 45');
    // }

    // @Cron(CronExpression.EVERY_12_HOURS)
    // handleCronEvery12Hours() {
    //     this.eventEmitter.emit('marketplace.get-from-monday');
    //
    // }
    //
    @Cron(CronExpression.EVERY_5_MINUTES)
    handleCronEvery2Hours() {
        this.eventEmitter.emit('check-users-interviews');

    }


}