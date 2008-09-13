/**
    Project: CheckTree jQuery Plugin
    Version: 0.2
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
        // Hide all of the sub-trees
        .find("ul")
            .hide()
        .end()
        
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
            .attr("checked", "")
            .hide()
        .end()
        
        
        .find("label")
            // Clicking the labels should expand the children
            .click(function() {
                var action = settings.labelAction;
                switch(settings.labelAction) {
                    case 'expand':
                        jQuery(this).siblings(".arrow").click();
                        break;
                    case 'check':
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
        
        .each(function() {
            // Create the image for the arrow (to expand and collapse the hidden trees)
            var $arrow = jQuery('<div class="arrow"></div>');
            
            // If it has children:
            if (jQuery(this).is(":has(ul)")) {
                $arrow.addClass("collapsed"); // Should start collapsed
                
                // When you click the image, toggle the child list
                $arrow.click(function() {
                    jQuery(this).siblings("ul").toggle();
                    
                    if (jQuery(this).hasClass("collapsed")) {
                        //toggled = settings.expandedarrow;
                        jQuery(this)
                            .addClass("expanded")
                            .removeClass("collapsed")
                        ;
                        if (settings.onExpand) settings.onExpand(jQuery(this).parent());
                    }
                    else {
                        //toggled = settings.collapsedarrow;
                        jQuery(this)
                            .addClass("collapsed")
                            .removeClass("expanded")
                        ;
                        if (settings.onCollapse) settings.onCollapse(jQuery(this).parent());
                    }
                });
            }
            
            // Create the image for the checkbox next to the label
            var $checkbox = jQuery('<div class="checkbox"></div>');
            
            // When you click the checkbox, it should do the checking/unchecking
            $checkbox.click(function() {
                // Make the current class checked
                jQuery(this)
                    // if it's half checked, its now either checked or unchecked
                    .removeClass("half_checked")
                    .toggleClass("checked")
                    
                    // Send a click event to the checkbox to toggle it as well
                    .siblings(":checkbox").click()
                ;
                
                // Check/uncheck children depending on our status.
                if (jQuery(this).hasClass("checked")) {
                    // Fire the check callback for this parent
                    if (settings.onCheck) settings.onCheck(jQuery(this).parent());
                    
                    jQuery(this).siblings("ul").find(".checkbox").not(".checked")
                        .removeClass("half_checked")
                        .addClass("checked")
                        .each(function() {
                            if (settings.onCheck) settings.onCheck(jQuery(this).parent());
                        })
                        .siblings(":checkbox")
                            .attr("checked", "checked")
                    ;
                }
                else {
                    // Fire the uncheck callback for this parent
                    if (settings.onUnCheck) settings.onUnCheck(jQuery(this).parent());
                    
                    jQuery(this).siblings("ul").find(".checkbox").filter(".checked")
                        .removeClass("half_checked")
                        .removeClass("checked")
                        .each(function() {
                            if (settings.onUnCheck) settings.onUnCheck(jQuery(this).parent());
                        })
                        .siblings(":checkbox")
                            .attr("checked", "")
                    ;
                }
                // Tell our parent checkbox that we've changed
                jQuery(this).parents("ul").siblings(":checkbox").change();
            });
            
            // Prepend the arrow and checkbox images to the front of the LI
            jQuery(this)
                .prepend($checkbox)
                .prepend($arrow)
            ;
        })
    ;

    return $tree;
};
})(jQuery);