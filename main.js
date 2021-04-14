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
const obektyMapActiveClass = "active";

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
						element.classList.add(obektyMapActiveClass);
					} else if (this.inited) {
						element.classList.remove(obektyMapActiveClass);
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

		const obektyMapIcon = {
			// Список всех меток
			list: {
				all: [],
			},
			offes: {
				icon: ymaps.templateLayoutFactory.createClass(`
					<svg style="transform: translateY(-100%);" width='40' height='59' viewBox="0 0 29 43" fill="none" xmlns="http://www.w3.org/2000/svg">
						<rect x="0.5" y="1.5" width="2" height="41" fill="#191B1E" stroke="white"/>
						<path d="M3.19874 1.54119L2.5 1.23853V2V21.6635V22.4267L3.1997 22.1219L25.8324 12.2619L26.8876 11.8022L25.8315 11.3447L3.19874 1.54119Z" fill="#191B1E" stroke="white"/>
						<path d="M10.2594 17.4941L8.17694 18.3976L6.49573 13.9365V19.1318L4.04724 20.1976V3.44116L6.49573 4.50587V9.19293L7.91997 5.12469L10.2012 6.11175L11.5503 14.4388L12.726 7.20469L17.9733 9.48116V10.5329L14.9418 9.21881L14.8157 9.99646L17.9733 11.3694V14.1341L13.8497 15.9376L14.2254 13.6247L16.2836 12.72L13.8497 11.6623L13.1018 16.2565L10.3248 17.4647L8.63876 8.99528L7.8133 11.2894L10.2594 17.4941Z" fill="white"/>
						<path d="M18.8473 9.86118L23.3285 11.8012L18.8473 13.7482V9.86118Z" fill="#F4691B"/>
					</svg>
					`),
				coordinates: null,
			},
			activGroup: null,
			controlGroup: {},
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

				const offesItem = mapWrap.querySelector(".markers > .map-marker");
				this.offes.coordinates = [offesItem.dataset.latitude, offesItem.dataset.longitude];
			},
		};
		obektyMapIcon.created();
		const optionSize = {
			zoomMargin: [40, 40, 40, 370],
			zoomControlBottom: 40,
			created() {
				if (document.documentElement.scrollWidth <= 920) {
					this.zoomMargin = [20, 20, 20, 100];
					this.zoomControlBottom = 100;
				} else {
					this.zoomMargin = [40, 40, 40, 370];
					this.zoomControlBottom = 40;
				}
			},
		};
		optionSize.created();

		let myMap = new ymaps.Map(map, {
			// Создаёт карту
			center: obektyMapIcon.offes.coordinates,
			zoom: 15,
			controls: [],
		});
		myMap.controls.add("zoomControl", {
			// Кнопки зума на карту
			size: "small",
			position: {
				left: "auto",
				top: "auto",
				bottom: optionSize.zoomControlBottom,
				right: 20,
			},
		});
		myMap.behaviors.disable("scrollZoom");

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
			// Рендер кнопок категории
			let item = document.createElement("li");
			item.className = "obekty-list__item";
			item.innerHTML = `
				<label class="obekty-list__button">
					<input class="obekty-list__input" type="radio" name="obekty-list" value="${params.key}" />
					<img src="${params.iconUrl}" width="40" height="40" alt="${params.text}" class="obekty-list__button-icon">
					<span class="obekty-list__button-text">${params.text}</span>
				</label>
			`;
			item.querySelector(".obekty-list__input").addEventListener("change", () => {
				myMap.geoObjects.removeAll();
				params.callback.apply(null, [params.key]);
				obektyMapIcon.activGroup = params.key;
			});

			params.wrap.insertAdjacentElement("beforeend", item);
		}

		function addIconOffesMap(myCollection) {
			// Вывод иконки офиса продаж
			const myPlacemark = new ymaps.Placemark(
				obektyMapIcon.offes.coordinates,
				{},
				{
					iconLayout: obektyMapIcon.offes.icon,
				}
			);
			myCollection.add(myPlacemark);
		}

		function addIconMap(key) {
			// Вывод иконок на карту
			const myCollection = new ymaps.GeoObjectCollection();
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
				myCollection.add(myPlacemark);
			}
			addIconOffesMap(myCollection);
			myMap.geoObjects.add(myCollection);
			myMap.setBounds(myCollection.getBounds(), {
				checkZoomRange: true,
				zoomMargin: optionSize.zoomMargin,
				duration: 500,
				timingFunction: "ease-in-out",
			});
		}

		for (const key in obektyMapIcon.list) {
			if (Object.hasOwnProperty.call(obektyMapIcon.list, key)) {
				obektyListItem({
					key: key,
					callback: addIconMap,
				});
			}
		}

		mapWrap.querySelectorAll(".obekty-list .obekty-list__button").forEach((item, index, list) => {
			// Активный класс для переключений групп
			const input = item.querySelector(".obekty-list__input");
			input.addEventListener("change", () => {
				for (const itemList of list) itemList.classList.remove(obektyMapActiveClass);
				item.classList.add(obektyMapActiveClass);
			});
			obektyMapIcon.controlGroup[input.value] = input;
			if (input.value === "all") item.click();
		});

		// Переключение табов объекты / офис
		const tabSwich = mapWrap.querySelectorAll("[data-obekty-swich]"),
			tabBlock = {};
		for (const block of mapWrap.querySelectorAll("[data-obekty-block]")) tabBlock[block.dataset.obektyBlock] = block;
		for (const tabSwichItem of tabSwich) {
			tabSwichItem.addEventListener("change", () => {
				for (const key in tabBlock) {
					if (Object.hasOwnProperty.call(tabBlock, key)) tabBlock[key].style.display = "none";
				}
				tabBlock[tabSwichItem.dataset.obektySwich].style.display = "block";

				if (tabSwichItem.dataset.obektySwich === "list") {
					obektyMapIcon.controlGroup[obektyMapIcon.activGroup].click();
				} else if (tabSwichItem.dataset.obektySwich === "offes") {
					obektyMapIcon.controlGroup[obektyMapIcon.activGroup].checked = false;
					myMap.geoObjects.removeAll();
					const myCollection = new ymaps.GeoObjectCollection();
					addIconOffesMap(myCollection);
					myMap.geoObjects.add(myCollection);
					myMap.setCenter(obektyMapIcon.offes.coordinates, 15, {
						checkZoomRange: true,
						duration: 500,
						timingFunction: "ease-in-out",
					});
				}
			});
			if (tabSwichItem.dataset.obektySwich === "list") tabSwichItem.click();
		}
	}
});
