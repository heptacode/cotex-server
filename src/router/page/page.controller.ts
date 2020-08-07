import { Request, Response, NextFunction } from "express";
import Controller from "../controller";
import User, { IUserSchema } from "../../schema/User";
import Page, { IPage } from "../../schema/Page";
import { HTTPRequestCode, StatusError } from "../../modules/Send-Rule";

class PageController extends Controller {
	/**
	 * @description 페이지 생성
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async createPage(req: Request, res: Response, next: NextFunction) {
		try {
			let user = req.user as IUserSchema;
			let pageData = req.body as IPage;
			pageData.owner = user._id;

			let page = await new Page(pageData).save();

			return super.response(res, HTTPRequestCode.CREATE, page, "페이지 생성 성공");
		} catch (err) {
			return next(err);
		}
	}
	/**
	 * @description 페이지 가져오기
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async getPage(req: Request, res: Response, next: NextFunction) {
		try {
			let user = req.user as IUserSchema;

			let pages = await Page.find({ owner: user._id });

			return super.response(res, HTTPRequestCode.OK, pages, "페이지 가져오기 성공");
		} catch (err) {
			return next(err);
		}
	}
	/**
	 * @description 내 페이지
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async myPage(req: Request, res: Response, next: NextFunction) {
		try {
			let user = req.user as IUserSchema;

			let pages = await Page.find({ owner: user._id });

			return super.response(res, HTTPRequestCode.OK, pages, "페이지 가져오기 성공");
		} catch (err) {
			return next(err);
		}
	}
	/**
	 * @description 콜라보레이터 추가
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async invitePage(req: Request, res: Response, next: NextFunction) {
		try {
			let user = req.user as IUserSchema;

			let userID = req.body.userID;
			let id = req.params.id;

			let target = await User.findOne({ userID });
			let page = await Page.findById(id);

			if (!target) next(new StatusError(HTTPRequestCode.NOT_FOUND, undefined, "존재하지 않음"));
			if (!page.ownerPermissionCheck(user)) return next(new StatusError(HTTPRequestCode.FORBIDDEN, "권한 없음"));
			if (page.collaborator.indexOf(target._id) != -1) super.response(res, HTTPRequestCode.OK, page, "이미 존재하는 유저");
			page.collaborator.push(target._id);
			return super.response(res, HTTPRequestCode.OK, await page.save(), "콜라보레이터 추가 성공");
		} catch (err) {
			return next(err);
		}
	}
	/**
	 * @description 콜라보레이터 제거
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async kickPage(req: Request, res: Response, next: NextFunction) {
		try {
			let user = req.user as IUserSchema;

			let userID = req.body.userID;
			let id = req.params.id;

			let target = await User.findOne({ userID });
			let page = await Page.findById(id);

			if (!target) next(new StatusError(HTTPRequestCode.NOT_FOUND, undefined, "존재하지 않음"));
			if (!page.ownerPermissionCheck(user)) return next(new StatusError(HTTPRequestCode.FORBIDDEN, "권한 없음"));
			let idx = page.collaborator.indexOf(target._id);
			if (idx == -1) super.response(res, HTTPRequestCode.OK, page, "존재하지 않는 유저");
			page.collaborator.splice(idx, 1);
			return super.response(res, HTTPRequestCode.OK, await page.save(), "콜라보레이터 제거 성공");
		} catch (err) {
			return next(err);
		}
	}
	/**
	 * @description 페이지 삭제
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async deletePage(req: Request, res: Response, next: NextFunction) {
		try {
			let user = req.user as IUserSchema;
			let id = req.params.id;

			let page = await Page.findById(id);
			if (page) {
				if (page.ownerPermissionCheck(user)) return super.response(res, HTTPRequestCode.NO_CONTENT, await Page.deleteOne(page), "글 삭제 성공");
				else return next(new StatusError(HTTPRequestCode.FORBIDDEN, "권한 없음"));
			} else return next(new StatusError(HTTPRequestCode.NOT_FOUND, undefined, "존재하지 않음"));
		} catch (err) {
			return next(err);
		}
	}
}

export default new PageController();
