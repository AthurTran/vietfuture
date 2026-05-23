import { prisma } from "../config/prisma";
import { hashPassword, comparePassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

const getUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: {
            email
        }
    });
};

export const registerService = async (data: any) => {
    const existing = await getUserByEmail(data.email);

    if (existing) {
        throw new Error("User with this email already exists");
    }

    const { password, ...userData } = data;
    const password_hash = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            ...userData,
            password_hash
        }
    });

    const token = generateToken({
        user_id: user.user_id,
        email: user.email,
        role: user.role
    });

    return {
        user,
        token
    };
};

export const loginService = async (email: string, password: string) => {
    const user = await getUserByEmail(email);

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isValid = await comparePassword(password, user.password_hash);

    if (!isValid) {
        throw new Error("Invalid credentials");
    }

    const token = generateToken({
        user_id: user.user_id,
        email: user.email,
        role: user.role
    });

    return {
        user,
        token
    };
};
