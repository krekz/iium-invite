"use server";

import got from "got";
import { parse } from "node-html-parser";

export async function getProfile(cookie: string) {
	try {
		const response = await got("https://imaluum.iium.edu.my/Profile", {
			headers: {
				Cookie: cookie,
			},
			https: { rejectUnauthorized: false },
			followRedirect: false,
		});

		const root = parse(response.body);

		const _email = root.querySelector(
			".row .col-md-12 .nav-tabs-custom .tab-content .tab-pane.active .row .col-md-9 ul li:nth-child(1) p",
		);
		const _iiumEmail = root.querySelector(
			".row .col-md-12 .nav-tabs-custom .tab-content .tab-pane.active .row .col-md-9 ul li:nth-child(2) p",
		);
		const _name = root.querySelector(
			".row .col-md-12 .box.box-default .panel-body.row .col-md-4[style='text-align:center; padding:10px; floaf:left;'] h4[style='margin-top:1%;']",
		);

		const _matricNo = root.querySelector(
			".row .col-md-12 .box.box-default .panel-body.row .col-md-4[style='margin-top:3%;'] h4",
		);

		if (
			!_name?.textContent ||
			!_matricNo?.textContent ||
			!_email?.textContent ||
			!_iiumEmail?.textContent
		) {
			console.log("_name: ", _name?.textContent.trim());
			console.log("_matricNo: ", _matricNo?.textContent);
			console.log("_email: ", _email?.textContent);
			console.log("_iiumEmail: ", _iiumEmail?.textContent);

			// Check if the selectors were found
			throw new Error("Selectors not found on the page.");
		}

		const name = _name.textContent?.trim();
		const matricNo = _matricNo.textContent?.trim().split("|")[0].trim();
		const imageURL = `https://smartcard.iium.edu.my/packages/card/printing/camera/uploads/original/${matricNo}.jpeg`;
		const email = _email.textContent?.trim();
		const iiumEmail = _iiumEmail.textContent?.trim();

		return {
			success: true,
			data: {
				imageURL,
				name,
				matricNo,
				email,
				iiumEmail,
			},
		};
	} catch (err) {
		console.log(err);
		throw new Error("Failed to fetch user profile");
	}
}
