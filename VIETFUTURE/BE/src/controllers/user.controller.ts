import { Request, Response } from "express";

import {
    getAllUsersService,
    getUserByIdService,
    createUserService,
    updateUserService,
    deleteUserService
} from "../services/user.service";

const getAllUsers = async (
    req: Request,
    res: Response
) => {
    const users = await getAllUsersService();

    return res.json(users);
};

const getUserById = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    const user = await getUserByIdService(id);

    return res.json(user);
};

const createUser = async (
    req: Request,
    res: Response
) => {
    const user = await createUserService(req.body);

    return res.json(user);
};

const updateUser = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    const user = await updateUserService(
        id,
        req.body
    );

    return res.json(user);
};

const deleteUser = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    await deleteUserService(id);

    return res.json({
        message: "Delete success"
    });
};
export { getAllUsers, getUserById, createUser, updateUser, deleteUser }