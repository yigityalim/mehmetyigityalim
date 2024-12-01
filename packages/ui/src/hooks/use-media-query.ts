"use client";
import { useCallback, useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
	const getMatches = useCallback((query: string) => {
		if (typeof window === "undefined") return false;
		return window.matchMedia(query).matches;
	}, []);

	const [matches, setMatches] = useState<boolean>(getMatches(query));

	useEffect(() => {
		const mediaQuery = window.matchMedia(query);
		const handler = () => setMatches(getMatches(query));

		handler();

		mediaQuery.addEventListener("change", handler);

		return () => mediaQuery.removeEventListener("change", handler);
	}, [query, getMatches]);

	return matches;
}

export function useResponsive() {
	const isMobile = useMediaQuery("(max-width: 768px)");
	const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
	const isDesktop = useMediaQuery("(min-width: 1025px)");

	return { isMobile, isTablet, isDesktop };
}
