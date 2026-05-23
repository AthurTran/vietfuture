import { prisma } from "../config/prisma";

const getAllUsersService = async () => {
    return await prisma.user.findMany();
};

const getUserByIdService = async (id: number) => {
    return await prisma.user.findUnique({
        where: {
            user_id: id
        }
    });
};

const createUserService = async (data: any) => {
    return await prisma.user.create({
        data
    });
};

const updateUserService = async (
    id: number,
    data: any
) => {
    return await prisma.user.update({
        where: {
            user_id: id
        },
        data
    });
};

const deleteUserService = async (id: number) => {
    return await prisma.user.delete({
        where: {
            user_id: id
        }
    });
};
export { getAllUsersService, getUserByIdService, createUserService, updateUserService, deleteUserService }