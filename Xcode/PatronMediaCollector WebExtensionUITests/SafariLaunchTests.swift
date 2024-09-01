//
//  SafariLaunchTests.swift
//  PatronMediaCollector WebExtensionUITests
//
//  Created by 강재홍 on 9/1/24.
//

import XCTest

final class SafariLaunchTests: XCTestCase {
    static var safari: XCUIApplication {
        #if os(iOS)
        XCUIApplication(bundleIdentifier: "com.apple.mobilesafari")
        #else
        XCUIApplication(bundleIdentifier: "com.apple.Safari")
        #endif
    }

    static var extensionButton: some XCUIElement {
        safari.toolbars.buttons["WebExtension-dev.sinoru.PatronMediaCollector.WebExtension (83XZ8ZBS6L)"]
    }

    static func goTo(location: String) {
        let addressBar = safari.toolbars.textFields["WEB_BROWSER_ADDRESS_AND_SEARCH_FIELD"]
        addressBar.typeKey("l", modifierFlags: .command)
        addressBar.typeText(location)
        addressBar.typeKey(.enter, modifierFlags: [])
    }

    override class func setUp() {
        let safari = self.safari
        safari.launch()

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

        if let isPatronMediaCollectorEnabled = patronMediaCollectorCheckBox.value as? Bool, !isPatronMediaCollectorEnabled {
            patronMediaCollectorCheckBox.click()
        }

        guard
            let isPatronMediaCollectorEnabled = patronMediaCollectorCheckBox.value as? Bool,
            isPatronMediaCollectorEnabled
        else {
            fatalError()
        }

        Self.goTo(location: "https://www.fanbox.cc")

        let extensionButton = Self.extensionButton // This button is not hittable due to insufficient permission
        extensionButton
            .coordinate(withNormalizedOffset: .zero)
            .withOffset(.init(dx: extensionButton.frame.size.width / 2, dy: extensionButton.frame.size.height / 2))
            .click()

        let allowAllButton = safari.popovers.buttons.element(boundBy: 2)
        allowAllButton.click()

        safari.terminate()
    }

    override class func tearDown() {
        let safari = self.safari
        safari.launch()

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

        if let isPatronMediaCollectorEnabled = patronMediaCollectorCheckBox.value as? Bool, isPatronMediaCollectorEnabled {
            patronMediaCollectorCheckBox.click()
        }

        guard
            let isPatronMediaCollectorEnabled = patronMediaCollectorCheckBox.value as? Bool,
            !isPatronMediaCollectorEnabled
        else {
            fatalError()
        }

        safari.terminate()
    }

    func testLaunch() throws {
        let safari = Self.safari
        safari.launch()

        let attachment = XCTAttachment(screenshot: safari.screenshot())
        attachment.name = "Launch Screen"
        attachment.lifetime = .keepAlways
        add(attachment)
    }

    func testFANBOX() throws {
        let safari = Self.safari
        safari.launch()

        Self.goTo(location: "https://www.fanbox.cc/@itiri/posts/8332491")

        let extensionButton = Self.extensionButton
        extensionButton.click()

        let attachment = XCTAttachment(screenshot: safari.screenshot())
        attachment.name = "pixivFANBOX Screen"
        attachment.lifetime = .keepAlways
        add(attachment)
    }
}
