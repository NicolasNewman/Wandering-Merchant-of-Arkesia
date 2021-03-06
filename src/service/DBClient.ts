import { PrismaClient, Guild } from '@prisma/client';
import { replyFactory, handlePrismaError } from '../helper';
import { ErrorCodes, ErrorHandlerOptions, GuildUpdate } from '../types';

class DBClient {
	public prisma: PrismaClient;

	constructor() {
		this.prisma = new PrismaClient();
	}

	public update = async (gid: string, data: GuildUpdate, options: ErrorHandlerOptions): Promise<Guild | null> => {
		try {
			const fetchedData = await this.prisma.guild.upsert({
				where: { guildId: gid },
				create: { ...data, guildId: gid },
				update: { ...data },
			});
			if (!fetchedData) {
				await replyFactory(options)(options.logger.error(ErrorCodes.GUILD_NOT_FOUND, 'Could not find guild.'));
			}
			return fetchedData;
		} catch (err) {
			handlePrismaError({ ...options, err });
			return null;
		}
	};

	public get = async (gid: string, options: ErrorHandlerOptions): Promise<Guild | null> => {
		try {
			const data = await this.prisma.guild.findUnique({
				where: { guildId: gid },
			});
			if (!data) {
				await replyFactory(options)(options.logger.error(ErrorCodes.GUILD_NOT_FOUND, 'Could not find guild.'));
			}
			return data;
		} catch (err) {
			handlePrismaError({ ...options, err });
			return null;
		}
	};
}

export default DBClient;
