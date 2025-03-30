/**
 * Interface for command handlers using the Command pattern
 */
export class CommandHandler {
  /**
   * Executes a command
   * @param {Object} command Command to execute
   * @returns {Promise<any>} Result of command execution
   */
  async execute(command) {
    throw new Error('Method not implemented');
  }
}
