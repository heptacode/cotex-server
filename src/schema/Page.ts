import { Model, Schema, Document, model, HookNextFunction, Mongoose } from "mongoose";
import { ObjectID } from "bson";
import { IUserSchema } from "./User";

export interface Cell {
	x: number;
	y: number;
	text?: string; // 텍스트
	img?: string; // 이미지 경로
}
export interface Permission {
	user: ObjectID; // 유저 uuid
	startX: number; // 시작좌표
	startY: number; // 시작좌표
	endX: number; // 끝좌표
	endY: number; // 끝좌표
}

export interface IPage {
	owner: ObjectID;
	collaborator: ObjectID[]; // 콜라보레이터
	content: string; // 간단한 내용
	cell: Cell[]; // 셀
	permission: Permission[]; // 영역 구간
	lastUpdateTime: Date;
	createTime: Date;
}
export const PageSchema: Schema = new Schema({
	owner: { type: Schema.Types.ObjectId, required: true, ref: "User" },
	collaborator: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
	content: { type: String, required: true },
	cell: { type: Array, default: [] },
	permission: { type: Array, default: [] },
	lastUpdateTime: { type: Date, default: Date.now },
	createdTime: { type: Date, default: Date.now },
});

/**
 * @description Page 스키마에 대한 메서드 ( document )
 */
export interface IPageSchema extends IPage, Document {
	/**
	 * @description 이 글에 대한 권한을 체크합니다.
	 * @returns {boolean} 글의 주인 여부를 반환합니다.
	 */
	ownerPermissionCheck(user: IUserSchema): boolean;
}

/**
 * @description Page 모델에 대한 정적 메서드 ( collection )
 */
export interface IPageModel extends Model<IPageSchema> {}

PageSchema.methods.ownerPermissionCheck = function (this: IPageSchema, user: IUserSchema): boolean {
	return (this.owner as ObjectID).equals(user._id);
};

export default model<IPageSchema>("Page", PageSchema) as IPageModel;
