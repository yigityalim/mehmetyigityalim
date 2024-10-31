import "./spinner.css";

const bars = Array(12).fill(0);

export function Spinner({ size = 16 }: Readonly<{ size: number }>) {
	return (
		<div className="loading-parent">
			<div
				className="loading-wrapper"
				data-visible
				// @ts-ignore
				style={{ "--spinner-size": `${size}px` }}
			>
				<div className="spinner">
					{bars.map((_, i) => (
						<div className="loading-bar" key={`spinner-bar-${i.toString()}`} />
					))}
				</div>
			</div>
		</div>
	);
}
