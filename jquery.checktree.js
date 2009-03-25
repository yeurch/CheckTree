/**
    Project: CheckTree jQuery Plugin
    Version: 0.22
    Project Website: http://static.geewax.org/checktree/
    Author: JJ Geewax <jj@geewax.org>
    
    License:
        The CheckTree jQuery plugin is currently available for use in all personal or 
        commercial projects under both MIT and GPL licenses. This means that you can choose 
        the license that best suits your project, and use it accordingly.
*/
(function(jQuery) {
jQuery.fn.checkTree = function(settings) {
    
    settings = jQuery.extend({
        /* Callbacks
            The callbacks should be functions that take one argument. The checkbox tree
            will return the jQuery wrapped LI element of the item that was checked/expanded.
        */
        onExpand: null,
        onCollapse: null,
        onCheck: null,
        onUnCheck: null,
        onHalfCheck: null,
        onLabelHoverOver: null,
        onLabelHoverOut: null,
        
        /* Valid choices: 'expand', 'check' */
        labelAction: "expand",
        
        // Debug (currently does nothing)
        debug: false
    }, settings);
    
    var $tree = this;
    
    $tree.find("li")
        
        // Hide all checkbox inputs
        .find(":checkbox")
            .change(function() {
                // Fired when the children of this checkbox have changed.
                // Children can change the state of a parent based on what they do as a group.
                var $all = jQuery(this).siblings("ul").find(":checkbox");
                var $checked = $all.filter(":checked");
                
                // All children are checked
                if ($all.length == $checked.length) {
                    jQuery(this)
                        .attr("checked", "checked")
                        .siblings(".checkbox")
                            .removeClass("half_checked")
                            .addClass("checked")
                    ;
                    // Fire parent's onCheck callback
                    if (settings.onCheck) settings.onCheck(jQuery(this).parent());
                }
                
                // All children are unchecked
                else if($checked.length == 0) {
                    jQuery(this)
                        .attr("checked", "")
                        .siblings(".checkbox")
                            .removeClass("checked")
                            .removeClass("half_checked")
                    ;
                    // Fire parent's onUnCheck callback
                    if (settings.onUnCheck) settings.onUnCheck(jQuery(this).parent());
                }
                
                // Some children are checked, makes the parent in a half checked state.
                else { 
                    // Fire parent's onHalfCheck callback only if it's going to change
                    if (settings.onHalfCheck && !jQuery(this).siblings(".checkbox").hasClass("half_checked"))
                        settings.onHalfCheck(jQuery(this).parent());
                    
                    jQuery(this)
                        .attr("checked", "")
                        .siblings(".checkbox")
                            .removeClass("checked")
                            .addClass("half_checked")
                    ;
                }
            })
            .css("display", "none")
        .end()
        
        .each(function() {
            
            // Go through and hide only ul's (subtrees) that do not have a sibling div.expanded:
            // We do this to not collapse *all* the subtrees (if one is open and checkTree is called again)
            jQuery(this).find("ul").each(function() {
                if (!jQuery(this).siblings(".expanded").length) jQuery(this).hide();
            });
            
            // Copy the label
            var $label = jQuery(this).children("label").clone();
            // Create or the image for the checkbox next to the label
            var $checkbox = jQuery("<div class=\"checkbox\"></div>");
            // Create the image for the arrow (to expand and collapse the hidden trees)
            var $arrow = jQuery("<div class=\"arrow\"></div>");
            
            // If the li has children:
            if (jQuery(this).is(":has(ul)")) {
                // If the subtree is not visible, make the arrow collapsed. Otherwise expanded.
                if (jQuery(this).children("ul").is(":hidden")) $arrow.addClass("collapsed");
                else $arrow.addClass("expanded");
                
                // When you click the image, toggle the child list
                $arrow.click(function() {
                    jQuery(this).siblings("ul").toggle();
                    
                    // Swap the classes: expanded <-> collapsed and fire the onExpand/onCollapse events
                    if (jQuery(this).hasClass("collapsed")) {
                        jQuery(this)
                            .addClass("expanded")
                            .removeClass("collapsed")
                        ;
                        if (settings.onExpand) settings.onExpand(jQuery(this).parent());
                    }
                    else {
                        jQuery(this)
                            .addClass("collapsed")
                            .removeClass("expanded")
                        ;
                        if (settings.onCollapse) settings.onCollapse(jQuery(this).parent());
                    }
                });
            }
            
            // When you click the checkbox, it should do the checking/unchecking
            $checkbox.click(function() {
                // Toggle the checked class)
                jQuery(this)
                    .toggleClass("checked")
                    // if it's half checked, its now either checked or unchecked
                    .removeClass("half_checked")
                    
                    // Send a click event to the checkbox to toggle it as well
                    // (this is the actual input element)
                    .siblings(":checkbox").click()
                ;
                
                // Check/uncheck children depending on our status.
                if (jQuery(this).hasClass("checked")) {
                    // Fire the check callback for this parent
                    if (settings.onCheck) settings.onCheck(jQuery(this).parent());
                    
                    // Go to the sibling list, and find all unchecked checkbox images
                    jQuery(this).siblings("ul").find(".checkbox").not(".checked")
                        // Set as fully checked:
                        .removeClass("half_checked")
                        .addClass("checked")
                        
                        // For each one, fire the onCheck callback
                        .each(function() {
                            if (settings.onCheck) settings.onCheck(jQuery(this).parent());
                        })
                        
                        // For each one, check the checkbox (actual input element)
                        .siblings(":checkbox")
                            .attr("checked", "checked")
                    ;
                }
                
                // If Unchecked:
                else {
                    // Fire the uncheck callback for this parent
                    if (settings.onUnCheck) settings.onUnCheck(jQuery(this).parent());
                    
                    // Go to the sibling list and find all checked checkbox images
                    jQuery(this).siblings("ul").find(".checkbox").filter(".checked")
                        // Set as fully unchecked
                        .removeClass("half_checked")
                        .removeClass("checked")
                        
                        // For each one fire the onUnCheck callback
                        .each(function() {
                            if (settings.onUnCheck) settings.onUnCheck(jQuery(this).parent());
                        })
                        
                        // For each one, uncheck the checkbox (the actual input element)
                        .siblings(":checkbox")
                            .attr("checked", "")
                    ;
                }
                
                // Tell our parent checkbox that we've changed (they might need to change their state)
                jQuery(this).parents("ul").siblings(":checkbox").change();
            });
            
            // Add the appropriate classes to the new checkbox image based on the old one:
            if (jQuery(this).children(".checkbox").hasClass("checked"))
                $checkbox.addClass("checked");
            else if (jQuery(this).children(":checkbox").attr("checked")) {
                $checkbox.addClass("checked");
                jQuery(this).parents("ul").siblings(":checkbox").change()
            }
            else if (jQuery(this).children(".checkbox").hasClass("half_checked"))
                $checkbox.addClass("half_checked");
            
            // Remove any existing arrows or checkboxes or labels
            jQuery(this).children(".arrow").remove();
            jQuery(this).children(".checkbox").remove();
            jQuery(this).children("label").remove();
            
            // Prepend the new arrow, label, and checkbox images to the front of the LI
            jQuery(this)
                .prepend($label)
                .prepend($checkbox)
                .prepend($arrow)
            ;
        })
        
        .find("label")
            // Clicking the labels should do the labelAction (either expand or check)
            .click(function() {
                var action = settings.labelAction;
                switch(settings.labelAction) {
                    case "expand":
                        jQuery(this).siblings(".arrow").click();
                        break;
                    case "check":
                        jQuery(this).siblings(".checkbox").click();
                        break;
                }
            })
            
            // Add a hover class to the labels when hovering
            .hover(
                function() { 
                    jQuery(this).addClass("hover");
                    if (settings.onLabelHoverOver) settings.onLabelHoverOver(jQuery(this).parent());
                },
                function() {
                    jQuery(this).removeClass("hover");
                    if (settings.onLabelHoverOut) settings.onLabelHoverOut(jQuery(this).parent());
                }
            )
        .end()
    ;

    return $tree;
};
})(jQuery);