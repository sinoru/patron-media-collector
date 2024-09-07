//
//  SafariLaunchTests.swift
//  PatronMediaCollector WebExtensionUITests
//
//  Created by Jaehong Kang on 9/1/24.
//

import XCTest

final class SafariLaunchTests: XCTestCase {
    static let appBundleIdentifier = "dev.sinoru.PatronMediaCollector"
    static let webExtensionBundleIdentifier = "\(appBundleIdentifier).WebExtension"

    static var isCI: Bool {
        ProcessInfo.processInfo.environment["CI"]?
            .trimmingCharacters(in: .whitespacesAndNewlines)
            .caseInsensitiveCompare("true") == .orderedSame
    }

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

        guard
            let developMode = developModeCheckBox.value as? Bool,
            developMode
        else {
            fatalError() // Due to static (Not instanized)
        }
    }

    override class func setUp() {
        if isCI {
            enableDevelopModeOnSafari()
        }
    }

    override func setUp() async throws {
        await registerExtension()

        let safari = Self.safari
        await safari.launch()

        if Self.isCI {
            await allowUnsignedExtension(for: safari)
            await setEnableExtension(for: safari, true)
            await allowExtensionPermission(for: safari)
        } else {
            await setEnableExtension(for: safari, true)
            await allowExtensionPermission(for: safari)
        }
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
    @MainActor
    private func registerExtension() {
        let app = XCUIApplication(bundleIdentifier: Self.appBundleIdentifier)
        app.launch()
        app.buttons["ShowSafariPreferencesForExtension"].click()
    }

    @MainActor
    private func allowUnsignedExtension(for safari: XCUIApplication) {
        safari.menus["ApplicationMenu"].menuItems["Preferences"].click()

        let preferencesWindow = safari.windows.firstMatch
        preferencesWindow.buttons.element(boundBy: 14).click()

        let allowUnsignedExtensionCheckBox = preferencesWindow.checkBoxes["_NS:62"]

        let uiInterruptionMonitor = addUIInterruptionMonitor(
            withDescription: "Authentication"
        ) { dialog in
            let passwordField = dialog.textFields.firstMatch

            guard passwordField.exists else {
                return false
            }

            passwordField.click()
            passwordField.typeKey(.enter, modifierFlags: [])

            return true
        }
        defer {
            removeUIInterruptionMonitor(uiInterruptionMonitor)
        }

        if let allowUnsignedExtension = allowUnsignedExtensionCheckBox.value as? Bool, !allowUnsignedExtension {
            allowUnsignedExtensionCheckBox.click()
        }

        sleep(1) // Wait for Authentication dialog
        allowUnsignedExtensionCheckBox.typeKey(.enter, modifierFlags: [])
        allowUnsignedExtensionCheckBox.rightClick() // Trigger Interruption Monitor

        let expectation = expectation(for: NSPredicate(format: "value == YES"), evaluatedWith: allowUnsignedExtensionCheckBox)
        wait(for: [expectation], timeout: 5.0)
    }

    @MainActor
    private func setEnableExtension(for safari: XCUIApplication, _ newValue: Bool) {
        safari.menus["ApplicationMenu"].menuItems["Preferences"].click()

        let preferencesWindow = safari.windows.firstMatch
        preferencesWindow.buttons.element(boundBy: 12).click()

        let patronMediaCollectorCell = preferencesWindow.cells.containing(NSPredicate(format: "value CONTAINS 'PatronMediaCollector'")).firstMatch
        XCTAssertTrue(patronMediaCollectorCell.exists)
        let patronMediaCollectorCheckBox = patronMediaCollectorCell.checkBoxes.firstMatch
        XCTAssertTrue(patronMediaCollectorCheckBox.exists)

        if let isPatronMediaCollectorEnabled = patronMediaCollectorCheckBox.value as? Bool, isPatronMediaCollectorEnabled != newValue {
            patronMediaCollectorCheckBox.click()
        }

        XCTAssertEqual(patronMediaCollectorCheckBox.value as? Bool, newValue)
    }

    @MainActor
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
