import FeatureSource from "../js/feature/featureSource.js";

// https://s3.amazonaws.com/igv.org.demo/GSM1872886_GM12878_CTCF_PET.bedpe.txt

function runBedpeTests() {

    // mock object

    const genome = {
        getChromosomeName: function (chr) {
            return chr.startsWith("chr") ? chr : "chr" + chr;
        }
    }

    QUnit.test("No header line -- column 7 score", async function (assert) {
        const chr = "chr12";
        const bpStart = 1;
        const bpEnd = Number.MAX_SAFE_INTEGER;
        const featureSource = FeatureSource({
                url: './data/bedpe/GSM1872886_GM12878_CTCF_PET.bedpe.txt',
                format: 'bedpe'
            },
            genome);

        const features = await featureSource.getFeatures(chr, bpStart, bpEnd);
        assert.ok(features);
        assert.equal(features.length, 3);

        for(let f of features) {
            assert.ok(!isNaN(f.value));
        }
    })

    QUnit.test("Header line -- no pound -- column 7 score all '.'", async function (assert) {
        const chr = "chr9";
        const bpStart = 1;
        const bpEnd = Number.MAX_SAFE_INTEGER;
        const featureSource = FeatureSource({
                url: './data/bedpe/hiccups_loops.bedpe',
                format: 'bedpe'
            },
            genome);

        const features = await featureSource.getFeatures(chr, bpStart, bpEnd);
        assert.ok(features);
        assert.equal(features.length, 5)

        for(let f of features) {
            assert.ok(isNaN(f.value));
        }
    })

    QUnit.test("Multiple header lines -- column 8 score", async function (assert) {
        const chr = "chr1";
        const bpStart = 1;
        const bpEnd = Number.MAX_SAFE_INTEGER;
        const featureSource = FeatureSource({
                url: './data/bedpe/inter_chr_simulated.bedpe',
                format: 'bedpe'
            },
            genome);

        const features = await featureSource.getFeatures(chr, bpStart, bpEnd);
        assert.ok(features);
        assert.equal(features.length, 5)

        for(let f of features) {
            assert.ok(f.name);
            assert.ok(!isNaN(f.value));
        }
    })

    QUnit.test("10X SV", async function (assert) {
        const chr = "chr1";
        const bpStart = 1;
        const bpEnd = Number.MAX_SAFE_INTEGER;
        const featureSource = FeatureSource({
                url: './data/bedpe/sv_calls.10X.bedpe',
                format: 'bedpe'
            },
            genome);

        const features = await featureSource.getFeatures(chr, bpStart, bpEnd);
        assert.ok(features);
        assert.equal(features.length,6)
        for(let f of features) {
            assert.ok(f.name);
            assert.ok(f.value > 0);
        }
    })

    QUnit.test("interact example 1", async function (assert) {
        const chr = "chr12";
        const bpStart = 1;
        const bpEnd = Number.MAX_SAFE_INTEGER;
        const featureSource = FeatureSource({
                url: './data/bedpe/interactExample1.txt',
                format: 'interact'
            },
            genome);

        const features = await featureSource.getFeatures(chr, bpStart, bpEnd);
        assert.ok(features);
        assert.equal(features.length,4)
        for(let f of features) {
            assert.ok(f.name);
            assert.equal(f.score, 0);
            assert.ok(f.value > 0);
        }
    })
}

export default runBedpeTests;
