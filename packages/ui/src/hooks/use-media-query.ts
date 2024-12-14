"use client";
import React from "react";

export function useMediaQuery(query: string) {
	const subscribe = React.useCallback(
		(callback: () => void) => {
			const matchMedia = window.matchMedia(query);

			matchMedia.addEventListener("change", callback);
			return () => {
				matchMedia.removeEventListener("change", callback);
			};
		},
		[query],
	);

	const getSnapshot = () => {
		return window.matchMedia(query).matches;
	};

	return React.useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export function useResponsive() {
	const isMobile = useMediaQuery("(max-width: 768px)");
	const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
	const isDesktop = useMediaQuery("(min-width: 1025px)");

	return { isMobile, isTablet, isDesktop };
}
