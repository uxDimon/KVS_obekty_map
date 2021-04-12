const obektyMapGroupName = {
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

		const animatedLayout = ymaps.templateLayoutFactory.createClass(
			// Создаём макет содержимого иконки.
			`
				<div class="obekty-map-icon">
					<div class="obekty-map-icon__popup">$[properties.icontext]</div>
					<img width="40" height="40" src="$[properties.iconUrl]" alt="$[properties.icontext]" />
				</div>
			`,
			{
				build: function () {
					animatedLayout.superclass.build.call(this);
					const element = this.getParentElement().querySelector(".obekty-map-icon__popup");

					const bigShape = {
						type: "Rectangle",
						coordinates: [
							[-20, -20],
							[20, 20],
						],
					};
					this.getData().options.set("shape", bigShape);
					if (this.isActive) {
						element.classList.add("active");
					} else if (this.inited) {
						element.classList.remove("active");
					}
					if (!this.inited) {
						this.isActive = false;
						this.inited = true;
						// При клике по метке будем перестраивать макет.
						this.getData().geoObject.events.add(
							"mouseenter",
							function () {
								this.isActive = !this.isActive;
								this.rebuild();
							},
							this
						);
						this.getData().geoObject.events.add(
							"mouseleave",
							function () {
								this.isActive = !this.isActive;
								this.rebuild();
							},
							this
						);
					}
				},
			}
		);

		let myMap = new ymaps.Map(map, {
			// Создаёт карту
			center: [59.875713, 30.335795],
			zoom: 14,
			controls: [],
		});
		myMap.controls.add("zoomControl", {
			// Кнопки зума на карту
			size: "small",
			position: {
				left: "auto",
				top: "auto",
				bottom: 40,
				right: 20,
			},
		});

		const obektyMapIcon = {
			// Список всех меток
			list: {
				all: [
					{
						iconUrl:
							"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40' fill='none' role='img'%3E%3Cg fill='%2368717B'%3E%3Crect x='11' y='11' width='4' height='4' rx='2'%3E%3C/rect%3E%3Crect x='11' y='18' width='4' height='4' rx='2'%3E%3C/rect%3E%3Crect x='11' y='25' width='4' height='4' rx='2'%3E%3C/rect%3E%3Crect x='18' y='11' width='4' height='4' rx='2'%3E%3C/rect%3E%3Crect x='18' y='18' width='4' height='4' rx='2'%3E%3C/rect%3E%3Crect x='18' y='25' width='4' height='4' rx='2'%3E%3C/rect%3E%3Crect x='25' y='11' width='4' height='4' rx='2'%3E%3C/rect%3E%3Crect x='25' y='18' width='4' height='4' rx='2'%3E%3C/rect%3E%3Crect x='25' y='25' width='4' height='4' rx='2'%3E%3C/rect%3E%3C/g%3E%3C/svg%3E",
						text: "Все объекты",
						coordinates: [59.87535966, 30.33422828],
					},
				],
			},
			created() {
				for (const icon of mapWrap.querySelectorAll(".markers > .grouped-map-marker")) {
					const iconOptions = {
						iconUrl: icon.dataset.icon,
						text: icon.dataset.markup,
						coordinates: [icon.dataset.latitude, icon.dataset.longitude],
					};

					if (this.list[icon.dataset.group] === undefined) this.list[icon.dataset.group] = [];

					this.list[icon.dataset.group].push(iconOptions);
				}
			},
		};
		obektyMapIcon.created();

		function obektyListItem(key, callback, iconList = null, name = null, wrap = null) {
			iconList = iconList ? iconList : obektyMapIcon.list;
			name = name ? name : obektyMapGroupName;
			wrap = wrap ? wrap : mapWrap.querySelector(".obekty-list");

			// Выбор категории меток
			let item = document.createElement("li");
			item.className = "obekty-list__item";
			item.innerHTML = `
				<label class="obekty-list__button">
					<input class="obekty-list__input" type="radio" name="obekty-list" />
					<img src="${iconList[key][0].iconUrl}" width="40" height="40" alt="${name[key]}" class="obekty-list__button-icon">
					<span class="obekty-list__button-text">${name[key]}</span>
				</label>
			`;
			item.querySelector(".obekty-list__input").addEventListener("change", () => {
				myMap.geoObjects.removeAll();
				callback.apply(null, [key]);
			});

			wrap.insertAdjacentElement("beforeend", item);
		}

		function addIconMap(key) {
			for (const icon of obektyMapIcon.list[key]) {
				const myPlacemark = new ymaps.Placemark(
					icon.coordinates,
					{
						icontext: icon.text,
						iconUrl: icon.iconUrl,
					},
					{
						iconLayout: animatedLayout,
					}
				);
				myMap.geoObjects.add(myPlacemark);
			}
		}
		console.log(obektyMapIcon.list);

		for (const key in obektyMapIcon.list) {
			if (Object.hasOwnProperty.call(obektyMapIcon.list, key)) {
				obektyListItem(key, addIconMap);
			}
		}
	}
});

// function name(params) {
// 	params = Object.assign(
// 		{
// 			id: 1,
// 			slector: "kakaka",
// 			list: {
// 				dddddd: "2",
// 			},
// 		},
// 		params
// 	);
// 	console.log(params);
// }
// name({
// 	id: 2,
// 	list: {
// 		ccccc: "3",
// 	},
// });
