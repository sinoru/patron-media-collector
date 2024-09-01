//
//  SafariLaunchTests.swift
//  PatronMediaCollector WebExtensionUITests
//
//  Created by 강재홍 on 9/1/24.
//

import XCTest

final class SafariLaunchTests: XCTestCase {
    static let appBundleIdentifier = "dev.sinoru.PatronMediaCollector"
    static let webExtensionBundleIdentifier = "\(appBundleIdentifier).WebExtension"

    static var safari: XCUIApplication {
        #if os(iOS)
        XCUIApplication(bundleIdentifier: "com.apple.mobilesafari")
        #else
        XCUIApplication(bundleIdentifier: "com.apple.Safari")
        #endif
    }

    static var extensionButton: some XCUIElement {
        safari.toolbars.buttons.element(
            matching: NSPredicate(
                format: "label BEGINSWITH %@", "WebExtension-\(webExtensionBundleIdentifier)"
            )
        )
    }

    static func goTo(with safari: XCUIApplication, location: String) {
        let addressBar = safari.toolbars.textFields["WEB_BROWSER_ADDRESS_AND_SEARCH_FIELD"]
        addressBar.typeKey("l", modifierFlags: .command)
        addressBar.typeText(location)
        addressBar.typeKey(.enter, modifierFlags: [])
    }

    static func enableDevelopModeOnSafari() {
        let safari = self.safari
        safari.launch()

        safari.menus["ApplicationMenu"].menuItems["Preferences"].click()

        let preferencesWindow = safari.windows.firstMatch
        preferencesWindow.buttons.element(boundBy: 13).click()

        let developModeCheckBox = preferencesWindow.checkBoxes["_NS:8"]

        if let developMode = developModeCheckBox.value as? Bool, !developMode {
            developModeCheckBox.click()
        }
    }

    override class func setUp() {
        enableDevelopModeOnSafari()

        let app = XCUIApplication(bundleIdentifier: appBundleIdentifier)
        app.launch()
        app.buttons["ShowSafariPreferencesForExtension"].click()
    }

    override func setUp() async throws {
        let safari = Self.safari
        await safari.launch()

        allowUnsignedExtension(for: safari)
        setEnableExtension(for: safari, true)
        allowExtensionPermission(for: safari)
    }

    func testLaunch() throws {
        let safari = Self.safari
        safari.activate()

        let attachment = XCTAttachment(screenshot: safari.screenshot())
        attachment.name = "Launch Screen"
        attachment.lifetime = .keepAlways
        add(attachment)
    }

    func testFANBOX() throws {
        let safari = Self.safari
        safari.activate()

        Self.goTo(with: safari, location: "https://www.fanbox.cc/@itiri/posts/8332491")

        let extensionButton = Self.extensionButton
        extensionButton.click()

        let attachment = XCTAttachment(screenshot: safari.screenshot())
        attachment.name = "pixivFANBOX Screen"
        attachment.lifetime = .keepAlways
        add(attachment)
    }
}

extension SafariLaunchTests {
    private func allowUnsignedExtension(for safari: XCUIApplication) {
        safari.menus["ApplicationMenu"].menuItems["Preferences"].click()

        let preferencesWindow = safari.windows.firstMatch
        preferencesWindow.buttons.element(boundBy: 14).click()

        let allowUnsignedExtensionCheckBox = preferencesWindow.checkBoxes["_NS:62"]

        if let allowUnsignedExtension = allowUnsignedExtensionCheckBox.value as? Bool, !allowUnsignedExtension {
            allowUnsignedExtensionCheckBox.click()
        }
    }

    private func setEnableExtension(for safari: XCUIApplication, _ newValue: Bool) {
        safari.menus["ApplicationMenu"].menuItems["Preferences"].click()

        let preferencesWindow = safari.windows.firstMatch
        preferencesWindow.buttons.element(boundBy: 12).click()

        let patronMediaCollectorCell = preferencesWindow.cells.containing(NSPredicate(format: "value CONTAINS 'PatronMediaCollector'")).firstMatch
        guard patronMediaCollectorCell.exists else {
            fatalError()
        }
        let patronMediaCollectorCheckBox = patronMediaCollectorCell.checkBoxes.firstMatch
        guard patronMediaCollectorCheckBox.exists else {
            fatalError()
        }

        if let isPatronMediaCollectorEnabled = patronMediaCollectorCheckBox.value as? Bool, isPatronMediaCollectorEnabled != newValue {
            patronMediaCollectorCheckBox.click()
        }

        guard
            let isPatronMediaCollectorEnabled = patronMediaCollectorCheckBox.value as? Bool,
            isPatronMediaCollectorEnabled == newValue
        else {
            fatalError()
        }
    }

    private func allowExtensionPermission(for safari: XCUIApplication) {
        Self.goTo(with: safari, location: "https://www.fanbox.cc")

        let extensionButton = Self.extensionButton // This button is not hittable due to insufficient permission
        extensionButton
            .coordinate(withNormalizedOffset: .zero)
            .withOffset(.init(dx: extensionButton.frame.size.width / 2, dy: extensionButton.frame.size.height / 2))
            .click()

        let allowAllButton = safari.popovers.buttons.element(boundBy: 2)
        allowAllButton.click()

        safari.windows.firstMatch.buttons[XCUIIdentifierCloseWindow].click()
    }
}
