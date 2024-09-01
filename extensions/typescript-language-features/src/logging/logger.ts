/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { memoize } from '../utils/memoize';

export class Logger {

	@memoize
	private get output(): vscode.LogOutputChannel {
		return vscode.window.createOutputChannel('TypeScript', { log: true });
	}

	public get logLevel(): vscode.LogLevel {
		return this.output.logLevel;
	}

	public info(message: string, ...args: any[]): void {
		this.log(vscode.LogLevel.Info, message, args)
	}

	public trace(message: string, ...args: any[]): void {
		this.log(vscode.LogLevel.Trace, message, args)
	}

	public error(message: string, data?: any): void {
		// See https://github.com/microsoft/TypeScript/issues/10496
		if (data && data.message === 'No content available.') {
			return;
		}
		this.log(vscode.LogLevel.Error, message, data ? [data] : [])
	}

	private now(): string {
		const now = new Date();
		return padLeft(now.getUTCHours() + '', 2, '0')
			+ ':' + padLeft(now.getMinutes() + '', 2, '0')
			+ ':' + padLeft(now.getUTCSeconds() + '', 2, '0') + '.' + now.getMilliseconds();
	}

	private data2String(data: any): string {
		if (data instanceof Error) {
			return data.stack || data.message;
		}
		if (data.success === false && data.message) {
			return data.message;
		}
		return data.toString();
	}

	public log(level: vscode.LogLevel, message: string, data?: any): void {
		this.output.appendLine(`[${level} - ${this.now()}] ${message}`);
		if (data) {
			this.output.appendLine(this.data2String(data));
		}
	}
}

function padLeft(s: string, n: number, pad = ' ') {
	return pad.repeat(Math.max(0, n - s.length)) + s;
}
