import { BeforeAll, Before, AfterAll, After } from '@cucumber/cucumber';
import { init, onTestStart, onTestDone, cleanup } from 'detox/internals';
import testData from '../../testData/TestData';

BeforeAll({ timeout: 60 * 1000 }, async () => {
    await init();
});

Before(async (testCase) => {
    let instanceBoolean = true;
    for (let i = 0; i < testCase.pickle.tags.length; i++) {
        let tag = testCase.pickle.tags[i].name;
        if ((tag === '@addmembers' || testData.getLastTag() === '@addmembers')
            || (tag === '@editmembers' || testData.getLastTag() === '@editmembers')) {
            instanceBoolean = false;
        } else if ((tag === '@addmembers') || (tag === '@editmembers')) {
            testData.setLastTag(tag);
        }
    }
    await device.launchApp({ delete: instanceBoolean, newInstance: true});
});

After(async (scenario) => {
    const testSummary = {
        fullName: scenario.pickle.name,
        status: scenario.result.status.toLowerCase()
    }

    await onTestDone(testSummary)
})

AfterAll(async () => {
    await cleanup();
});