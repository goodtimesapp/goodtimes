// @ts-ignore
import wd from 'wd';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
const PORT = 4723;
const config = {
    platformName: 'Android',
    deviceName: 'Pixel 3',
    app: '/Users/Nick/Desktop/code/goodtimes/src/app/android/app/build/outputs/apk/release/app-release.apk',
    automationName: "UiAutomator2",
    appWaitForLaunch: false
};
const driver = wd.promiseChainRemote('localhost', PORT);
beforeAll(async () => {
    await driver.init(config);
    await driver.sleep(3000);
}) // Sometime for the app to load
test('appium renders', async () => {
    //await driver.hasElementByAccessibilityId('indexPage');
    //const indexPage = await driver.elementByAccessibilityId('indexPage')

    let acceptLocation = await driver.elementById("com.android.permissioncontroller:id/permission_allow_always_button");
    await acceptLocation.click();
    
  
    let el2 = await driver.elementByXPath("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[8]");
    await el2.click();
    await el2.click();
    await el2.click();
    await el2.click();
    await el2.click();
    let el3 = await driver.elementByXPath("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.widget.HorizontalScrollView/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup");
    await el3.click();

    await driver.sleep(8000);

    let el4 = await driver.elementByXPath("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup/android.widget.EditText");
    await el4.click();
    await el4.sendKeys("hello");
    let el5 = await driver.elementByXPath("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[2]/android.view.ViewGroup[2]");
    await el5.click();
    let el6 = await driver.elementByXPath("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.ScrollView/android.view.ViewGroup/android.view.ViewGroup[1]/android.view.ViewGroup/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.RelativeLayout[2]");
    await el6.click();

    

     // expect(await driver.hasElementByAccessibilityId('notHere')).toBe(false);
});