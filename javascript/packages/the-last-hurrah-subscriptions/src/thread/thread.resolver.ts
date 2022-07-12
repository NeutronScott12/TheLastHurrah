import { Resolver } from '@nestjs/graphql';
import { ThreadService } from './thread.service';

@Resolver()
export class ThreadResolver {
  constructor(private readonly threadService: ThreadService) {}
}
