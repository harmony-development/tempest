module.exports = {
	moduleFileExtensions: ["js", "ts", "json", "vue"],
	transform: {
		"^.+\\.ts$": "esbuild-jest",
		"^.+\\.vue$": "vue-jest",
	},
};
