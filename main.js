const obektyMapGroupName = {
	all: {
		text: "Все объекты",
		icon:
			"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40' fill='none' role='img'%3E%3Cg fill='%2368717B'%3E%3Crect x='11' y='11' width='4' height='4' rx='2'%3E%3C/rect%3E%3Crect x='11' y='18' width='4' height='4' rx='2'%3E%3C/rect%3E%3Crect x='11' y='25' width='4' height='4' rx='2'%3E%3C/rect%3E%3Crect x='18' y='11' width='4' height='4' rx='2'%3E%3C/rect%3E%3Crect x='18' y='18' width='4' height='4' rx='2'%3E%3C/rect%3E%3Crect x='18' y='25' width='4' height='4' rx='2'%3E%3C/rect%3E%3Crect x='25' y='11' width='4' height='4' rx='2'%3E%3C/rect%3E%3Crect x='25' y='18' width='4' height='4' rx='2'%3E%3C/rect%3E%3Crect x='25' y='25' width='4' height='4' rx='2'%3E%3C/rect%3E%3C/g%3E%3C/svg%3E",
	},
	services: {
		text: "Услуги",
		icon: "",
	},
	money: {
		text: "Финансы",
		icon: "",
	},
	education: {
		text: "Образование",
		icon: "",
	},
	medicine: {
		text: "Медицина и здоровье",
		icon: "",
	},
	food: {
		text: "Продукты",
		icon: "",
	},
	sport: {
		text: "Спорт",
		icon: "",
	},
	beauty: {
		text: "Красота",
		icon: "",
	},
	cafe: {
		text: "Кафе и рестораны",
		icon: "",
	},
	art: {
		text: "Творчество",
		icon: "",
	},
	transport: {
		text: "Транспорт",
		icon: "",
	},
	parking: {
		text: "Паркинги",
		icon: "",
	},
	clothes: {
		text: "Одежда",
		icon: "",
	},
	magazin: {
		text: "Магазины",
		icon: "",
	},
	recreation: {
		text: "Досуг и отдых",
		icon: "",
	},
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
				all: [],
			},
			created() {
				for (const icon of mapWrap.querySelectorAll(".markers > .grouped-map-marker")) {
					const iconOptions = {
						iconUrl: icon.dataset.icon,
						text: icon.dataset.markup,
						coordinates: [icon.dataset.latitude, icon.dataset.longitude],
					};
					if (!Array.isArray(this.list[icon.dataset.group])) {
						this.list[icon.dataset.group] = [];
						obektyMapGroupName[icon.dataset.group].icon = icon.dataset.icon;
					}
					this.list[icon.dataset.group].push(iconOptions);
				}

				for (const key in this.list) {
					if (Object.hasOwnProperty.call(this.list, key)) this.list.all.push(...this.list[key]);
				}
			},
		};
		obektyMapIcon.created();
		console.log(obektyMapIcon.list);
		console.log(obektyMapGroupName);

		function obektyListItem(params) {
			params = Object.assign(
				{
					key: null,
					callback: null,
					iconUrl: obektyMapGroupName[params.key].icon,
					text: obektyMapGroupName[params.key].text,
					wrap: mapWrap.querySelector(".obekty-list"),
				},
				params
			);
			// Выбор категории меток
			let item = document.createElement("li");
			item.className = "obekty-list__item";
			item.innerHTML = `
				<label class="obekty-list__button">
					<input class="obekty-list__input" type="radio" name="obekty-list" />
					<img src="${params.iconUrl}" width="40" height="40" alt="${params.text}" class="obekty-list__button-icon">
					<span class="obekty-list__button-text">${params.text}</span>
				</label>
			`;
			item.querySelector(".obekty-list__input").addEventListener("change", () => {
				myMap.geoObjects.removeAll();
				params.callback.apply(null, [params.key]);
			});

			params.wrap.insertAdjacentElement("beforeend", item);
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

		for (const key in obektyMapIcon.list) {
			if (Object.hasOwnProperty.call(obektyMapIcon.list, key)) {
				obektyListItem({
					key: key,
					callback: addIconMap,
				});
			}
		}
	}
});
