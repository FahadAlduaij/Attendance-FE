import { makeAutoObservable, runInAction } from "mobx";

import instance from "./instance";

class AbsentStore {
	constructor() {
		makeAutoObservable(this);
	}

	absents = [];

	fetchAbsents = async () => {
		try {
			const res = await instance.get("/absents");
			runInAction(() => {
				this.absents = res.data;
			});
		} catch (error) {
			console.log(error);
		}
	};

	createAbsent = async (absentInfo) => {
		try {
			const res = await instance.post("/absents/posts", absentInfo);
			this.fetchAbsents();

			// there is a problem in push with DataGrid Pro
		} catch (error) {
			console.log(error);
		}
	};

	updateAbsent = async (absent) => {
		try {
			const foundAbsent = this.absents.find(
				(_absent) => _absent.id === absent.id
			);

			const newAbsent = {
				...foundAbsent,
				day: absent.day,
				date: absent.date,
				type: absent.type,
			};

			const res = await instance.put(`/absents/${foundAbsent._id}`, newAbsent);
			runInAction(() => {
				this.absents.map((_absent) =>
					_absent.id === absent.id ? res.data : _absent
				);
			});
			this.fetchAbsents();
		} catch (error) {
			console.log(error);
		}
	};

	deleteAbsent = async (absentId) => {
		try {
			const foundAbsent = this.absents.find(
				(_absent) => _absent.id === absentId
			);

			await instance.delete(`/absents/${foundAbsent._id}`);
			const filteredArray = this.absents.filter(
				(a) => a._id !== foundAbsent._id
			);
			runInAction(() => {
				this.absents = filteredArray;
			});
		} catch (error) {
			console.log(error);
		}
	};
}

const absentStore = new AbsentStore();
absentStore.fetchAbsents();
export default absentStore;
