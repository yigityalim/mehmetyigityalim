"use client";

import NextImage, { type ImageProps as NextImageProps } from "next/image";
import React from "react";

export type ImageProps = NextImageProps & {};

export function Image(props: ImageProps) {
	const [loading, setLoading] = React.useState(true);
	return (
		<div className="relative w-full h-full">
			<NextImage
				{...props}
				loading="lazy"
				loader={({ src }) => src}
				onLoad={() => setLoading(false)}
				className="object-cover w-full h-full"
			/>
			{loading && (
				<div className="absolute inset-0 flex items-center justify-center">
					<svg
						className="animate-spin h-6 w-6 text-gray-400"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						/>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8 8 0 0112 4v8h8c0 4.418-3.582 8-8 8V17z"
						/>
					</svg>
				</div>
			)}
		</div>
	);
}
