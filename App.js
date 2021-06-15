/*******************************************************************************************************/
// Imnportamos las dependencias //
/*******************************************************************************************************/
import React, { Children, useEffect, useState } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Image, TextInput } from 'react-native';
import { fetchData } from './services/fetchData';

/*******************************************************************************************************/
// Definimos el componente para el item de moneda de la lista //
/*******************************************************************************************************/
const Item = ({ coin }) => (
	<View style={styles.item}>
		<View style={styles.item_left}>
			<Image style={styles.item_image} source={{ uri: coin.image }} />
			<View style={styles.item_desc}>
				<Text style={styles.item_title}>{coin.name}</Text>
				<Text style={styles.item_symbol}>{coin.symbol}</Text>
			</View>
		</View>
		<View style={styles.item_right}>
			<Text style={styles.item_price}>{`$ ${coin.current_price}`}</Text>
			<Text
				style={[
					styles.item_variant,
					coin.price_change_percentage_24h >= 0 ? { color: '#8DC647' } : { color: '#E15241' }
				]}
			>{`${coin.price_change_percentage_24h} %`}</Text>
		</View>
	</View>
);

/*******************************************************************************************************/
// Componente Principal de la Aplicación //
/*******************************************************************************************************/
const App = () => {
	// Definimos los valores iniciales de nuestras monedas y la data cambiante
	const [data, setData] = useState([]);
	const [coins, setCoins] = useState([]);
	// Definimos el estado de refrescar de la app
	const [refreshing, setRefreshing] = useState(false);

	// Función para obtener la información desde la Api de CoinGecko
	const getData = async mount => {
		const url =
			'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';
		const res = await fetchData(url);
		if (res && res.status && mount) {
			setData(res.data);
			setCoins(res.data);
		}
		return;
	};

	// Efecto para obtener las monedas desde la Api de CoinGecko, y guardarlas en el estado local
	useEffect(() => {
		let mount = true;
		getData(mount);
		// Limpiamos la montada
		return () => {
			mount = false;
		};
	}, [getData]);

	// Función para filtrar texto buscado en la lista de monedas
	const onChangeText = async text => {
		const promises = coins
			.map(ele => ele)
			.filter(ele => {
				return (
					ele.name.toLowerCase().includes(text.trim().toLowerCase()) ||
					ele.symbol.toLowerCase().includes(text.trim().toLowerCase())
				);
			});
		const dataFilter = await Promise.all(promises);
		setData(dataFilter);
	};

	// Componente del item renderizado
	const renderItem = ({ item }) => <Item coin={item} />;

	// Renderizamos el componente
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>CryptoMarket</Text>
				<TextInput
					style={styles.search}
					onChangeText={onChangeText}
					placeholder="Buscar moneda"
					placeholderTextColor="#858585"
				></TextInput>
			</View>
			<FlatList
				style={styles.list}
				data={data}
				renderItem={renderItem}
				keyExtractor={item => item.id}
				showsVerticalScrollIndicator={false}
				refreshing={refreshing}
				onRefresh={async () => {
					setRefreshing(true);
					await getData(true);
					setRefreshing(false);
				}}
			/>
		</SafeAreaView>
	);
};

/*******************************************************************************************************/
// Definimos los Estilos del Componente //
/*******************************************************************************************************/
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#141414',
		marginTop: StatusBar.currentHeight || 0,
		alignItems: 'center'
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		marginVertical: 8,
		backgroundColor: '#0B0B0B',
		paddingHorizontal: '5%',
		paddingTop: '2%',
		paddingBottom: '3%'
	},
	title: {
		color: '#ffffff',
		fontSize: 20
	},
	search: {
		color: '#ffffff',
		borderBottomColor: '#29D0FD',
		borderBottomWidth: 1,
		width: '45%'
	},
	list: {
		width: '90%'
	},
	item: {
		backgroundColor: '#121212',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 5,
		marginVertical: 4,
		borderBottomColor: '#DCDCDC',
		borderBottomWidth: 0.5
	},
	item_left: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	item_desc: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		marginLeft: 14
	},
	item_image: {
		width: 32,
		height: 32
	},
	item_title: {
		color: '#ffffff',
		fontSize: 16
	},
	item_symbol: {
		color: '#757575',
		textTransform: 'uppercase'
	},
	item_right: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-end'
	},
	item_price: {
		color: '#ffffff',
		fontSize: 16
	},
	item_variant: {
		fontSize: 15
	}
});

/*******************************************************************************************************/
// Exportamos el Componente por defecto //
/*******************************************************************************************************/
export default App;
