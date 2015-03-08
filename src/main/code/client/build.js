// To Build use CMD in ./client: "node r.js -o build.js"

({
	paths: {
		goo: "../../../../../../../../projects/goojs/src/goo",
		'goo/lib': '../lib',
		data_pipeline:'submodules/data_pipeline/src',
		particle_system:'submodules/particles_2/src',
		environment:'submodules/environment/src',
		terrain:'submodules/terrain/src',
		gui:'submodules/canvas_gui_3d/src'
	},
    baseUrl: "./js",
    name: "Main",
    out: "build/tunnan.js"
})