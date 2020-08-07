import { Request, Response, NextFunction } from "express";
import Controller from "../controller";
import { IUserSchema } from "../../schema/User";
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
