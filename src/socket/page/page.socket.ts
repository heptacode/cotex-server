import { SocketRouter } from "../../modules/SocketIO-Manager";
import User from "../../schema/User";
import Page from "../../schema/Page";

const socketRouter: SocketRouter = (io: SocketIO.Server, socket: SocketIO.Socket) => {
	// pageId, userToken
	socket.on("joinRoom", async (data) => {
		// let user = await User.quickTokenLogin(data.userToken);
		// if (!user) return;
		// let page = await Page.findById(data.pageId);
		// if (!page) return;
		// if (!(page.ownerPermissionCheck(user) || page.collaborator.indexOf(user._id) != -1)) return;
		socket.join(data.pageId);

		socket.emit("joinRoom", false); // FIXME: DEBUG
	});
	// pageId
	socket.on("update", async (data) => {
		let page = await Page.findById(data.pageId);
		page.permission = data.permission || page.permission;
		page.cell = data.cell || page.cell;
		if (!page) return;
		io.sockets.to(data.pageId).emit("update", await page.save());
	});
};

export default socketRouter;
