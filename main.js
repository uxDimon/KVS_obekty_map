const group = {
	services: "Услуги",
	money: "Финансы",
	education: "Образование",
	medicine: "Медицина и здоровье",
	food: "Продукты",
	sport: "Спорт",
	beauty: "Красота",
	cafe: "Кафе и рестораны",
	art: "Творчество",
	transport: "Транспорт",
	parking: "Паркинги",
	clothes: "Одежда",
	magazin: "Магазины",
	recreation: "Досуг и отдых",
};

ymaps.ready(function () {
	for (const mapWrap of document.querySelectorAll(".obekty-map")) {
		const map = mapWrap.querySelector(".obekty-map__map");

		var myMap = new ymaps.Map(
				map,
				{
					center: [55.751574, 37.573856],
					zoom: 9,
				},
				{
					searchControlProvider: "yandex#search",
				}
			),
			// Создаём макет содержимого.
			MyIconContentLayout = ymaps.templateLayoutFactory.createClass('<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'),
			myPlacemarkWithContent = new ymaps.Placemark(
				[55.661574, 37.573856],
				{
					hintContent: "Собственный значок метки с контентом",
					iconContent: "12",
				},
				{
					// Опции.
					// Необходимо указать данный тип макета.
					iconLayout: "default#imageWithContent",
					// Своё изображение иконки метки.
					iconImageHref: "./cafe.svg",
					// Размеры метки.
					iconImageSize: [48, 48],
					// Смещение левого верхнего угла иконки относительно
					// её "ножки" (точки привязки).
					iconImageOffset: [-24, -24],
					// Смещение слоя с содержимым относительно слоя с картинкой.
					iconContentOffset: [15, 15],
					// Макет содержимого.
					iconContentLayout: MyIconContentLayout,
					iconCaption: "Животный мир Австралии",
				}
			);

		myMap.geoObjects.add(myPlacemarkWithContent);
	}
});
