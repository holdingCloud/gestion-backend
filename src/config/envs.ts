import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    jwtSecret: string;
    DEFAULT_CYCLE_DAYS: number;
}

const evnsSchema = joi.object<EnvVars>({
    PORT: joi.number().default(3000),
    jwtSecret: joi.string().default('defaultSecret'),
    DEFAULT_CYCLE_DAYS: joi.number().default(30),
}).unknown(true);

const { error, value } = evnsSchema.validate({
    ...process.env,
});

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envsVarrs: EnvVars = value;

export const envs = {
    port: envsVarrs.PORT,
    JWT_SECRET: envsVarrs.jwtSecret,
    DEFAULT_CYCLE_DAYS: envsVarrs.DEFAULT_CYCLE_DAYS,
}