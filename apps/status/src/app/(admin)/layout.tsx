export default function Layout({ children }) {
	return (
		<div className="p-6 w-full flex flex-col gap-4 items-center justify-center min-h-dvh">
			{children}
		</div>
	);
}
