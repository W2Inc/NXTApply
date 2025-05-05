import * as echarts from 'echarts';
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ }) => {

	let chart = echarts.init(null, null, {
		renderer: 'svg', // must use SVG rendering mode
		ssr: true, // enable SSR
		width: 800, // need to specify height and width
		height: 300
	});

	// use setOption as normal
	chart.setOption( {
		xAxis: {
			data: ['A', 'B', 'C', 'D', 'E']
		},
		yAxis: {},
		series: [
			{
				data: [10, 22, 28, 43, 49],
				type: 'line',
				stack: 'x'
			},
			{
				data: [5, 4, 3, 5, 10],
				type: 'line',
				stack: 'x'
			}
		]
	});


	// Output a string
	const svgStr = chart.renderToSVGString();

	// If chart is no longer useful, consider disposing it to release memory.
	chart.dispose();
	return {
		svgStr
	};
};