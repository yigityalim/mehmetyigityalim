"use client";

import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({
	error,
}: {
	error: Error & { digest?: string };
}) {
	useEffect(() => {
		if (error.digest) {
			console.error(`Error digest: ${error.digest}`);
		} else {
			console.error(error);
		}
	}, [error]);

	return (
		<html lang="en">
			<body>
				<NextError statusCode={0} withDarkMode title="Bir sorun oluştu" />
			</body>
		</html>
	);
}
