import { ErrorCodes, IEvent } from '../types';

export default {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isCommand()) return;

		const { logger, commands } = interaction.client;

		const command = commands.get(interaction.commandName);
		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			await interaction.reply({
				content: logger.error(
					ErrorCodes.COMMAND_EXECUTION_ERROR,
					'There was an issue executing the command',
				),
				ephemeral: true,
			});
		}
	},
} as IEvent<'interactionCreate'>;
