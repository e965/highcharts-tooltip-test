import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';

const getData = async () => {
	const getDataset = async file => {
		const dataResponse = await fetch(`./dataset/${file}`);
		const data = await dataResponse.json();
		return data;
	};

	const Files = ['1.json', '2.json', '3.json', '4.json'];

	const Data = await Promise.all(Files.map(fileName => getDataset(fileName)));

	return Data;
};

const findMinMaxPoints = (data) => {
	const SharedPoints = data.map(pointsArray => {return pointsArray.map(point => point.y)}).flat()

	const MaxPoint = Math.max(SharedPoints)
	const MinPoint = Math.min(SharedPoints)

	return {
		max: MaxPoint,
		min: MinPoint
	}
}

const getContainerSize = (containerNode) => {
	return {
		width: containerNode.clientWidth,
		height: containerNode.clientHeight,
	};
};

(async () => {
	const Highcharts = await import('highcharts');

	const Container = document.querySelector('#container');

	const Data = await getData();

	const InitialContainerSize = getContainerSize(Container);

	const MinMaxPoints = findMinMaxPoints(Data)

	console.log(MinMaxPoints)

	const XAxisData = [
		{
			id: 'main',
			type: 'datetime',
			title: {
				text: null,
			},
		},
	];

	const YAxisData = [...new Array(4)].map((_, index) => ({
		id: `yAxis_${index}`,
	}));

	const SeriesData = Data.map((pointsArray, index) => ({
		type: 'line',
		id: index,
		name: `Data ${index}`,
		data: pointsArray.map(point => ([
			+new Date(point.x),
			point.y
		])),
		xAxis: 'main',
		yAxis: `yAxis_${index}`,
	}));

	const Chart = Highcharts.chart('container', {
		title: {
			text: '',
		},
		chart: {
			width: InitialContainerSize.width,
			height: InitialContainerSize.height,
		},
		xAxis: XAxisData,
		yAxis: YAxisData,
		series: SeriesData,
	});

	window.addEventListener('resize', () => {
		const ContainerSize = getContainerSize(Container);
		Chart.setSize(ContainerSize.width, ContainerSize.height);
	});
})();
